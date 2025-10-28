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

// --- Imports Adicionados ---
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { CacheModule } from '@nestjs/cache-manager'; // <-- ADICIONEI ESTA LINHA

@Module({
  imports: [
    // --- Módulo Adicionado (Corrigido) ---
    ThrottlerModule.forRoot([ // <-- Correção: Adicionado [
      { // <-- Correção: Adicionado {
        ttl: 1, // Tempo de vida em segundos (1 segundo)
        limit: 50, // Limite de 50 requisições por IP a cada 1 segundo
      } // <-- Correção: Adicionado }
    ]), // <-- Correção: Adicionado ]
    // --- Fim da Adição ---

// --- Módulo de Cache Adicionado ---
    CacheModule.register({
      isGlobal: true, // Torna o cache disponível em toda a aplicação
      ttl: 60 * 1000, // Tempo de vida do cache em milissegundos (60 segundos)
    }),
    // --- Fim da Adição ---
    
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
    EventEmitterModule.forRoot(),
  ],
  providers: [
    SellListener,
    // --- Provider Adicionado ---
    // Isso aplica o Rate Limiter em TODAS as rotas
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // --- Fim da Adição ---
  ],
})
export class AppModule {}