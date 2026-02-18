import { hostname } from 'os';
import { promises as fs } from 'node:fs';
import { dump } from 'js-yaml';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';

import { APIModule } from './api.module';

const ENV = process.env.NODE_ENV || 'unknown';

const setupSwagger = async (app: INestApplication): Promise<void> => {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Microblog Service')
    .setVersion('0.0.1')
    .addBasicAuth(
      {
        type: 'http',
        in: 'header',
        bearerFormat: 'JWT',
        scheme: 'Basic',
        name: 'Authorization',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'Swagger documentation',
  });

  // generate new doc in dev mode
  if (process.env.NODE_ENV === 'development') {
    await fs.writeFile('swagger.yaml', dump(document));
  }
};

async function bootstrap() {
  const app = await NestFactory.create(APIModule, {
    bufferLogs: true,
    cors: true,
    logger: WinstonModule.createLogger({
      level: ['development'].includes(ENV) ? 'debug' : 'info',
      transports: [
        new transports.Console({
          format: ['development'].includes(ENV)
            ? format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                format.ms(),
                utilities.format.nestLike('Microblog Feed Service Dev', {
                  colors: true,
                  prettyPrint: true,
                }),
              )
            : format.printf((msg) => {
                const logFormat = {
                  hostname: hostname(),
                  app: process.env.APP_NAME,
                  environment: process.env.NODE_ENV,
                  level: msg.level,
                  msg: msg.message,
                  product: 'Microblog Feed Service',
                  time: new Date().toISOString(),
                };

                return JSON.stringify(logFormat);
              }),
        }),
      ],
    }),
  });

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT', 8081);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: false,
        exposeDefaultValues: true,
      },
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  console.log('Starting API service on port: ', port);

  await setupSwagger(app);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
