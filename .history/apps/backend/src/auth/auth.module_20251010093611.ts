import { Inject, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "../users/users.module";
import { SendConfirmationEmailListener } from "src/listeners/sendEmailRegisterListener";
import { LogRegisterListener } from "src/listeners/logRegisterListener";
import { Subject } from "src/observer/subject";
import { RegisterCreatedEvent } from "src/events/register-created.event";
import { LoginListener } from "src/listeners/loginListener";
import { LoginEvent } from "src/events/login-event";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    SendConfirmationEmailListener,
    LogRegisterListener,
    Subject,
  ],
  exports: [AuthService],
})
export class AuthModule {
  //Injetando nos construtores
  constructor(
    private readonly subject: Subject<any>,
    private readonly emailListener: SendConfirmationEmailListener,
    private readonly logListener: LogRegisterListener
  ) {}

  //iniciando listeners
  onModuleInit() {
    this.subject.attach(this.emailListener);
    this.subject.attach(this.logListener);
  }
}
