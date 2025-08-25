import dotenv from 'dotenv';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

dotenv.config();

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  MAIL_FROM_NAME: string;

  @IsString()
  MAIL_FROM_EMAIL: string;
}

const envVars = plainToInstance(EnvironmentVariables, {
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
  MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
});

const errors = validateSync(envVars, {
  skipMissingProperties: false,
});

if (errors.length > 0) {
  console.error('❌ Erro nas variáveis de ambiente:', errors);
  process.exit(1);
}

export const env = envVars;
