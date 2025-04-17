import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { RegionModule } from './region/region.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { VariantModule } from './variant/variant.module';
import { ReturnModule } from './return/return.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ExchangeModule } from './exchange/exchange.module';



@Module({
  imports: [PrismaModule, AuthModule, ColorModule, CategoryModule, RegionModule, CustomerModule, ProductModule, 
    TransactionModule, VariantModule, ReturnModule, UploadModule,
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file'
    }),
     ExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
