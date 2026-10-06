import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dapursari IMS API')
    .setDescription(
      [
        '## Inventory Management System — Dapursari',
        '',
        'Dokumentasi REST API untuk autentikasi, manajemen user, dan modul operasional (gudang/kitchen).',
        '',
        '### Cara memakai Authorize (JWT)',
        '1. Buka **POST /auth/login**',
        '2. Isi email & password (contoh seed: `admin@dapursari.local`)',
        '3. Salin `accessToken` dari response',
        '4. Klik tombol **Authorize** di atas, isi: `Bearer <accessToken>` atau cukup token saja',
        '5. Endpoint bertanda gembok sekarang bisa dipanggil dari Swagger UI',
        '',
        '### Role',
        '| Role | Akses |',
        '| --- | --- |',
        '| `SUPER_ADMIN` | Seluruh fitur termasuk kelola user |',
        '| `ADMIN_GUDANG` | Fitur gudang |',
        '| `ADMIN_KITCHEN` | Fitur kitchen |',
        '',
        '### Catatan',
        '- Logout bersifat stateless: client tetap harus menghapus token di browser.',
        '- Password tidak pernah dikembalikan di response API.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Tempel accessToken dari POST /auth/login. Contoh: eyJhbGciOiJIUzI1NiIs...',
      },
      'access-token',
    )
    .addTag('Health', 'Status layanan API')
    .addTag('Auth', 'Login, logout, profil, dan ubah password')
    .addTag('Users', 'Kelola user — hanya Super Admin')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Dapursari IMS — API Docs',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 24px 0; }
      .swagger-ui .info .title { font-size: 2rem; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 16px; border-radius: 8px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

void bootstrap();
