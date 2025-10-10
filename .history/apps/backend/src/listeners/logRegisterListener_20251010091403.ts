import { Injectable } from "@nestjs/common";
import { RegisterCreatedEvent } from "../events/register-created.event";
import { Observer } from "src/observer/subject";

@Injectable()
export class LogRegisterListener implements Observer<RegisterCreatedEvent> {
  update(event: RegisterCreatedEvent): void {
    console.log(`📧 Enviando email de registro para ${event.userEmail}`);
  }
}
