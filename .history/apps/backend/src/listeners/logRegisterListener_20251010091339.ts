import { Injectable } from "@nestjs/common";
import { RegisterCreatedEvent } from "../events/register-created.event";
import { Observer } from "src/observer/subject";

@Injectable()
export class SendConfirmationEmailListener {
  @OnEvent("register.created")
  handleOrderCreatedEvent(event: RegisterCreatedEvent) {
    console.log(`📧 Enviando email de registro para ${event.userEmail}`);
  }
}
