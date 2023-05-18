import * as passport from 'passport';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AtGuard } from './guards/at-auth.guard';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ); // to allow the pipes for the verification we want to do on our dto and stripe out the fields that we don't need
  app.use(cookieParser());
  app.use(passport.initialize());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'authorization'],
  });

  // For Swagger
  const config = new DocumentBuilder() 
    .setTitle('Amelk_transcendance')
    .setDescription('MyTranscendance API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4001, '0.0.0.0', () => {
    console.log('Listening on port 4001');
  });
}
bootstrap();
