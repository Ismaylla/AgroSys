import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express"; // <-- MUDANÇA 1: Importar o Request

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passReqToCallback: true, // <-- MUDANÇA 2: Adicionar esta linha
    });
  }

  // MUDANÇA 3: Mudar a assinatura (parâmetros) do 'validate'
  async validate(
    req: Request, // <-- 1. Receber o 'req'
    email: string,
    password: string
  ): Promise<any> {
    
    const ip = req.ip; // <-- 2. Pegar o IP de dentro do 'req'

    // 3. Passar o IP para o serviço de autenticação
    const user = await this.authService.validateUser(email, password, ip);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}