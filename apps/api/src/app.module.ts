import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UnitsModule } from './modules/units/units.module';
import { ItemsModule } from './modules/items/items.module';
import { StockInModule } from './modules/stock-in/stock-in.module';
import { WarehouseStockModule } from './modules/warehouse-stock/warehouse-stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    SuppliersModule,
    CategoriesModule,
    UnitsModule,
    ItemsModule,
    StockInModule,
    WarehouseStockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
