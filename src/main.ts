import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart'; 
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  await app.register(multipart);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.getHttpAdapter().getInstance().register(require('@fastify/static'), {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0')
  console.log(`Server running on ${port}`);
}
bootstrap();