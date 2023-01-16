import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from "passport"
import {ValidationPipe} from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());


  app.use(passport.initialize());

  await app.listen(8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
