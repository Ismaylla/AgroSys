// import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
// import { PrismaModule } from "./prisma/prisma.module";
// import { AuthModule } from "./auth/auth.module";
// import { UsersModule } from "./users/users.module";
// import { ToolModule } from "./tool/tool.module";
// import { ProductsModule } from "./products/products.module";
// import { SalesModule } from "./sales/sales.module";
// import { InvoicesModule } from "./invoices/invoices.module";
// import { HarvestsModule } from "./harvests/harvests.module";
// import { UapsModule } from "./uaps/uaps.module";
// import { InputMaterialEntryModule } from "./inputMaterialEntry/inputMaterialEntry.module";
// import { AlertsModule } from "./alerts/alerts.module";
// import { InsumosModule } from "./insumos/insumos.module";
// import { EventEmitterModule } from "@nestjs/event-emitter";
// import { SellListener } from "./listeners/sellListener";

// // --- Imports adicionados ---
// import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
// import { APP_GUARD } from "@nestjs/core";
// import { CacheModule } from "@nestjs/cache-manager";
// import { TestController } from "./test/test.controller";

// @Module({
//   imports: [
//     // --- Configuração correta do Throttler ---
//     ThrottlerModule.forRoot({
//       throttlers: [
//         {
//           name: "default",
//           ttl: 1000, // 1 segundo (em milissegundos)
//           limit: 50, // 50 requisições
//         },
//         {
//           name: "login-bruteforce",
//           ttl: 600_000, // 10 minutos
//           limit: 5, // 5 tentativas
//         },
//       ],
//     }),
//     // --- Fim do Throttler ---

//     // --- Cache Global ---
//     CacheModule.register({
//       isGlobal: true,
//       ttl: 60 * 1000, // 60 segundos
//     }),
//     // --- Fim do Cache ---

//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     PrismaModule,
//     AuthModule,
//     UsersModule,
//     ToolModule,
//     ProductsModule,
//     SalesModule,
//     InvoicesModule,
//     HarvestsModule,
//     UapsModule,
//     InputMaterialEntryModule,
//     AlertsModule,
//     InsumosModule,
//     EventEmitterModule.forRoot(),
//   ],

//   controllers: [TestController], // 👈 garante que o test controller é carregado

//   providers: [
//     SellListener,
//     // --- Aplica o Rate Limiter globalmente ---
//     {
//       provide: APP_GUARD,
//       useClass: ThrottlerGuard,
//     },
//   ],
// })
// export class AppModule {}
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
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SellListener } from "./listeners/sellListener";

import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { CacheModule } from "@nestjs/cache-manager";
import { TestController } from "./test/test.controller";

@Module({
  imports: [
    // ✅ Configuração correta para @nestjs/throttler@6.4.0
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 50,  // 50 requisições por minuto (global)
      },
    ]),

    // ✅ Cache global
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),

    // ✅ Demais módulos
    ConfigModule.forRoot({ isGlobal: true }),
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
    EventEmitterModule.forRoot(),
  ],

  controllers: [TestController],

  providers: [
    SellListener,
    // ✅ Habilita o rate limiter global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
