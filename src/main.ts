import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 路由全局前缀
  app.setGlobalPrefix('api');

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 允许跨域
  app.enableCors();

  // 端口
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
