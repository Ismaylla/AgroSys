import { Injectable, Module } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SellEvent } from "src/events/sell.event";
import { InvoicesService } from "src/invoices/invoices.service";

@Injectable()
export class SellListener {
  constructor(private readonly invoiceService: InvoicesService) {}

  @OnEvent("sell.registered")
  handleSelldEvent(event: SellEvent): void {
    console.log(
      "Venda cadastrada com sucesso, iniciando criação de nota fiscal."
    );

    this.invoiceService.createFromSale(event.saleId);
  }
}
