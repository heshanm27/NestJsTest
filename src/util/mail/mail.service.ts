import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // no need to set host or port etc.
      auth: {
        user: process.env.NODEMAILER_GMAIL_MAIL,
        pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendMail(to: string, otpCode: string) {
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL_MAIL,
      to,
      subject: 'NestJS OTP Verification',
      html: `<h1>Welcome to LayoutIndex</h1>
      <strong>Your OTP Code Is <h1>${otpCode}</h1></strong>
      <p>Use this code for Verification </p>
      `,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error Sending Mail');
    }
  }
}
