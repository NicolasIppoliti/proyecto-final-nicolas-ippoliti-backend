// Imports
import dotenv from 'dotenv-flow';
import express from 'express';
import { connect } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import __dirname from './utils.js';

// Socket.io imports
import http from 'http';
import { Server } from 'socket.io';

// Passport imports
import passport from 'passport';
import './config/passport.js'

// Routes imports
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/carts.js';

// Swagger imports
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

// Logger import
import logger from './config/winston.js';

// Mocking module import
import generateMockData from './models/mockup/mocking.module.js';

// Initialization
dotenv.config();
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Enable CORS
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io configuration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});
const swaggerDocument = yaml.load('./swagger/swagger.yaml');

io.on('connection', (socket) => {
  logger.info('a user connected');

  socket.on('disconnect', () => {
    logger.info('user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// Generate mock data
app.get('/mockup', async (req, res, next) => {
  try {
    await generateMockData();
    res.json({ message: 'Mock data generated successfully' });
  } catch (err) {
    next(err);
  }
});

// Swagger configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// JSON configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport configuration
app.use(passport.initialize());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Start server
server.listen(app.get('port'), () => {
  logger.info(`Server is running on port ${app.get('port')}`)
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// MongoDB connection
connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

export default app;
