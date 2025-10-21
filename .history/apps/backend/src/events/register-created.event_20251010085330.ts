export class RegisterCreatedEvent {
  constructor(
    public readonly name: string,
    public readonly userEmail: string
  ) {}
}
