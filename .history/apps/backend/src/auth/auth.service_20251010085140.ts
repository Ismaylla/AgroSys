import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "@shared/dto/user/create.user.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { RegisterCreatedEvent } from "src/events/register-created.event";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2
  ) {}

  async validateUser(
    email: string,
    pass: string
  ): Promise<{ id: string; email: string; name: string } | null> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
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
      }
    }

    return null;
  }

  async login(user: { id: string; email: string; name: string }) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Buscar dados completos do usuário para obter a role
    const fullUser = await this.usersService.findOne(user.id);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: fullUser?.role || "COMMON",
      },
    };
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

    this.eventEmitter.emit(
      "register.created",
      new RegisterCreatedEvent(user.name.getName(), user.email.getEmail())
    );

    return { message: "Usuário registrado com sucesso", user };
  }
}
