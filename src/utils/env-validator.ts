import dotenv from 'dotenv';
import * as Joi from '@hapi/joi';

dotenv.config();

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;

  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM_NAME: string;
  MAIL_FROM_EMAIL: string;
}

const envSchema = Joi.object<EnvVars>({
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().uri().required(),
  MAIL_HOST: Joi.string().hostname().required(),
  MAIL_PORT: Joi.number().port().required(),
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASSWORD: Joi.string().min(6).required(),
  MAIL_FROM_NAME: Joi.string().required(),
  MAIL_FROM_EMAIL: Joi.string().email().required(),
})
  .unknown(true) // Permite outras variáveis de ambiente
  .required();

const validationResult = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (validationResult.error) {
  const errorMessages = validationResult.error.details
    .map((detail) => detail.message)
    .join('\n');
  console.error('❌ Erro nas variáveis de ambiente:\n', errorMessages);
  process.exit(1);
}

export const env = validationResult.value as EnvVars;
