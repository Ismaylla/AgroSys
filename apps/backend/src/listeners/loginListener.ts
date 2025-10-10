import { Injectable } from "@nestjs/common";
import { LoginEvent } from "../events/login-event";
import { Observer } from "src/observer/subject";

@Injectable()
export class LoginListener implements Observer<LoginEvent> {
  update(event: LoginEvent): void {
    console.log(`📝 Log: Usuario ${event.userEmail} logou no sistema`);
  }
}
