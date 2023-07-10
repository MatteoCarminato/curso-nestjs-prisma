import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //procura a .env e coloca em todo o projeto
  ConfigModule.forRoot();

  //ISSO LIMITA O BRTUEFORCE;
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
