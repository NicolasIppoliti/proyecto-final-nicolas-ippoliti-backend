import winston from 'winston';

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const devFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.simple(),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const developmentLogger = winston.createLogger({
  level: 'debug',
  levels,
  format: devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/fatal.log', level: 'fatal' })
  ],
});

const productionLogger = winston.createLogger({
  level: 'info',
  levels,
  format: prodFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/fatal.log', level: 'fatal' })
  ],
});

const logger = process.env.NODE_ENV === 'development' ? developmentLogger : productionLogger;

export default logger;
