import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "@shared/dto/user/create.user.dto";
import { RegisterCreatedEvent } from "src/events/register-created.event";
import { Subject } from "src/observer/subject";
import { LoginEvent } from "src/events/login-event";

// --- Imports Adicionados para o Cache ---
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject("REGISTER_SUBJECT")
    private readonly subject: Subject<RegisterCreatedEvent>,
    @Inject("LOGIN_SUBJECT")
    private readonly subjectLogin: Subject<LoginEvent>,

    // --- Injeção do Cache Adicionada ---
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async validateUser(
    email: string,
    pass: string,
    ip: string // <-- MUDANÇA 1: Receber o IP
  ): Promise<{ id: string; email: string; name: string } | null> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      // Esta operação (bcrypt) ainda é lenta e será executada sempre.
      const isPasswordValid = await bcrypt.compare(
        pass,
        user.password.getPassword()
      );

      if (isPasswordValid) {
        const { password, ...result } = user;
        const userResult = {
          id: result.id,
          email: result.email.getEmail(),
          name: result.name.getName(),
        };
        this.logger.log(`Login successful for user: ${userResult.email}`);
        return userResult;
      } else {
        // MUDANÇA 2: Usar o IP no log
        this.logger.warn(
          `Login FAILED (Invalid Password) for user: ${email} from IP: ${ip}`
        );
      }
    } else {
      // MUDANÇA 3: Usar o IP no log
      this.logger.warn(
        `Login FAILED (User Not Found) for email: ${email} from IP: ${ip}`
      );
    }
    return null;
  }

  async login(user: { id: string; email: string; name: string }) {
    // --- LÓGICA DE CACHE (INÍCIO) ---
    // 1. Define uma chave de cache única para a *resposta* do login deste usuário
    const cacheKey = `login-response:${user.email}`;

    // 2. Tenta pegar a resposta completa do cache
    const cachedResponse = await this.cacheManager.get(cacheKey);

    // 3. Se a resposta existir no cache, retorna ela imediatamente!
    if (cachedResponse) {
      // Notifica o login (pois é um login válido)
      this.subjectLogin.notify(new LoginEvent(user.email));
      // Retorna o objeto cacheado
      return cachedResponse;
    }
    // --- LÓGICA DE CACHE (FIM) ---

    // --- O código abaixo só roda se NÃO houver cache ---

    // 4. Gera o payload e o token (operação LENTA de CPU)
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // 5. Busca dados completos do usuário (operação LENTA de DB)
    const fullUser = await this.usersService.findOne(user.id);

    // 6. Notifica o evento de login
    this.subjectLogin.notify(new LoginEvent(fullUser.email.getEmail()));

    // 7. Cria o objeto de resposta
    const response = {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: fullUser?.role || "COMMON",
      },
    };

    // --- LÓGICA DE CACHE (SALVAR) ---
    // 8. Salva a resposta completa no cache (com o TTL global de 60s)
    await this.cacheManager.set(cacheKey, response);
    // --- FIM ---

    // 9. Retorna a resposta nova
    return response;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email.getEmail()
    );
    if (existingUser) {
      throw new ConflictException("Email já está em uso.");
    }

    const userToCreate = {
      email: createUserDto.email.getEmail(),
      password: createUserDto.password.getPassword(),
      name: createUserDto.name.getName(),
      role: createUserDto.role,
    };

    const user = await this.usersService.create(userToCreate);
    this.logger.log(`User registered successfully: ${user.email.getEmail()}`);

    this.subject.notify(
      new RegisterCreatedEvent(user.name.getName(), user.email.getEmail())
    );

    return { message: "Usuário registrado com sucesso", user };
  }
}