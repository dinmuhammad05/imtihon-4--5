import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbConfig } from 'src/config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from 'src/infrastructure/exeption/allexeption';
import cookieParser from 'cookie-parser';

export class Aplication {
  static async main() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    app.use(cookieParser());


    const api = 'api/v1';


    app.setGlobalPrefix(api);

    const config = new DocumentBuilder()
      .setTitle('DinMuhammad')
      .setDescription('The "labrary"  API description')
      .setVersion('1.0')
      .addTag('DinMuhammad')
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(api, app, documentFactory);
    await app.listen(dbConfig.PORT, () =>
      console.log('server running on port', dbConfig.PORT),
    );
  }
}
