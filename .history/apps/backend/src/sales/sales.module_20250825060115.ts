import { Module } from "@nestjs/common";
import { SalesController } from "./sales.controller";
import { SalesService } from "./sales.service";
import { SaleRepositoryPostgres } from "./repositories/Postgres/SaleRepository.postgres";
import { PrismaService } from "../prisma/prisma.service";
import { SALE_REPOSITORY } from "./repositories/saleToken";
import { PermissionsGuard } from "@shared/permissions";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [ProductsModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    PrismaService,
    PermissionsGuard,
    {
      provide: SALE_REPOSITORY,
      useClass: SaleRepositoryPostgres,
    },
  ],
  exports: [SalesService],
})
export class SalesModule {}
