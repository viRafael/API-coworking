import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app/app.module';
import { env } from './utils/env-validator';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API - Reserva de salas')
    .setDescription('Projeto final desenvolvino no PT-DEV em Backend da TITAN')
    .setVersion('1.0')
    .addTag('PROJETO FINAL')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  await app.listen(env.PORT);
}

bootstrap()
  .then(() => {
    console.log(
      `\n[PROJETO FINAL]: Servidor rodando em: http://localhost:${env.PORT}\n` +
        `Documentação Swagger rodando em: http://localhost:${env.PORT}/api`,
    );
  })
  .catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  });
