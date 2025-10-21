import { Module } from "@nestjs/common";
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
export class AuthModule {}
