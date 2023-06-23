import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const fs = require('fs');
  const keyFile = fs.readFileSync('D:/Everything i need/ПСКП/Курсовой/typetizione/backend/ssl/localhost.key');
  const certFile = fs.readFileSync('D:/Everything i need/ПСКП/Курсовой/typetizione/backend/ssl/localhost.crt');
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
    }
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
