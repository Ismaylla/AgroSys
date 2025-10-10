import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RegisterCreatedEvent } from "../events/register-created.event";

@Injectable()
export class SendConfirmationEmailListener {
  @OnEvent("register.created")
  handleOrderCreatedEvent(event: RegisterCreatedEvent) {
    console.log(`📧 Enviando email de registro para ${event.userEmail}`);
  }
}
