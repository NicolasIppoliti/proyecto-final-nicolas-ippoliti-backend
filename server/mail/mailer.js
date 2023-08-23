import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'contacto.nicolasippoliti@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetMail(user, token, req) {
    const mailOptions = {
      to: user.email,
      from: 'contacto.nicolasippoliti@gmail.com',
      subject: 'Password Reset',
      text: 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendEmail(to, subject, text) {
    const mailOptions = {
      from: 'contacto.nicolasippoliti@gmail.com',
      to: to,
      subject: subject,
      text: text
  };

  await this.transporter.sendMail(mailOptions);
  }
}
