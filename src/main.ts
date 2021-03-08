import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import * as config from 'config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { ratelimitConfig } from './config/ratelimit.config';
dotenv.config();

const RMQConfig = config.get('RMQ');

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: serverConfig.logger,
  });
  app.disable('x-powered-by');
  app.use(
    '/documentation',
    express.static(process.cwd() + serverConfig.documentation),
  );
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
    // setup swagger
    const document = SwaggerModule.createDocument(app, swaggerConfig.options);
    SwaggerModule.setup('swagger', app, document);
  } else {
    app.set('trust proxy', 1);
    app.enableCors({ origin: serverConfig.origin });
    app.use(ratelimitConfig);
    logger.warn(`Accepting requests from origin "${serverConfig.origin}"`);
  }
  app.use(helmet());
  app.use(compression());
  const port = process.env.PORT || serverConfig.port;
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: RMQConfig.urls,
      queue: RMQConfig.queue,
      noAck: false,
      prefetchCount: 1,
      persistent: true,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservicesAsync();
  if (process.env.WORKER !== 'true')
    await app.listen(port, () =>
      console.log('Lead app running on localhost:%s', port),
    );
}
bootstrap();
