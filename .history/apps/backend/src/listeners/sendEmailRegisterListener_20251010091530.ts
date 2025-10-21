import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RegisterCreatedEvent } from '../events/register-created.event';
import { Observer } from 'src/observer/subject';

@Injectable()
export class SendConfirmationEmailListener {
  @OnEvent('register.created')
  handleOrderCreatedEvent(event: RegisterCreatedEvent) {
export class SendConfirmationEmailListener implements Observer<RegisterCreatedEvent> {
  update(event: RegisterCreatedEvent): void {
    console.log(`📧 Enviando email de registro para ${event.userEmail}`);
  }
}