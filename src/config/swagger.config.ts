import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = {
  options: new DocumentBuilder()
    .setTitle('Test API')
    .setDescription('&#10084;&#65039; Create with love &#10084;&#65039;')
    .setVersion('1.0')
    .build(),
};
