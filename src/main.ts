import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 路由全局前缀
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
