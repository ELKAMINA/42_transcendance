import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import AppModule from './app.module';

// main.ts file = entrypoint for the app's process. The bootstrap method creates the Nest application and initializes it.
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Nest container

  /* Communications layer: Début  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ); // to allow the pipes for the verification we want to do on our dto and stripe out the fields that we don't need
  app.use(cookieParser());
  app.use(passport.initialize());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://0.0.0.0:4001', 'http://localhost:4001', '*'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'authorization'],
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  /* Communications layer : FIN */

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
    /* app.listen(XXXX) binds the communications layer with the nest container. */
  });
}
bootstrap();
