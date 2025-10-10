import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ToolModule } from "./tool/tool.module";
import { ProductsModule } from "./products/products.module";
import { SalesModule } from "./sales/sales.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { HarvestsModule } from "./harvests/harvests.module";
import { UapsModule } from "./uaps/uaps.module";
import { InputMaterialEntryModule } from "./inputMaterialEntry/inputMaterialEntry.module";
import { AlertsModule } from "./alerts/alerts.module";
import { InsumosModule } from "./insumos/insumos.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ToolModule,
    ProductsModule,
    SalesModule,
    InvoicesModule,
    HarvestsModule,
    UapsModule,
    InputMaterialEntryModule,
    AlertsModule,
    InsumosModule,
  ],
})
export class AppModule {}
