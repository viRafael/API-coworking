import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generatePasswordResetTemplate } from './template/passwordReset.template';
import { env } from 'src/utils/env-validator';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: Number(env.MAIL_PORT),
      secure: false, // Gmail usa 587 (STARTTLS)
      auth: {
        user: env.MAIL_USER, // Seu email Gmail
        pass: env.MAIL_PASSWORD, // Senha de app (16 caracteres)
      },
      // Configurações específicas para Gmail
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const { subject, html } = generatePasswordResetTemplate(token);

    await this.transporter.sendMail({
      to: email,
      from: `${env.MAIL_FROM_NAME || 'Noreply'} <${env.MAIL_FROM_EMAIL || env.MAIL_USER}>`,
      subject,
      html,
    });
  }

  async sendMail(to: string, from?: string, subject = 'Hello', html?: string) {
    const info = await this.transporter.sendMail({
      from:
        from ||
        `${env.MAIL_FROM_NAME || 'Noreply'} <${env.MAIL_FROM_EMAIL || env.MAIL_USER}>`,
      to,
      subject,
      html: html || '<p>Email de teste do Gmail via NestJS!</p>',
    });

    return info;
  }

  // Método para testar a configuração
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Gmail connection successful!');
      return true;
    } catch (error) {
      console.error('❌ Gmail connection failed:', error);
      return false;
    }
  }
}
