import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generatePasswordResetTemplate } from './template/passwordReset.template';
import { env } from 'src/utils/env-validator';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: true,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASSWORD,
    },
  });

  async sendPasswordResetEmail(email: string, token: string) {
    const { subject, html } = generatePasswordResetTemplate(token);

    await this.transporter.sendMail({
      from: `Noreplay <${env.MAIL_USER}>`,
      to: email,
      subject,
      html,
    });
  }

  async sendMail(to: string, from: string, html: string) {
    const info = await this.transporter.sendMail({
      from,
      to,
      subject: `Hello`,
      html,
    });

    return info;
  }
}
