import { Command } from "../interfaces/command";
import { IUserRepository } from "../users/repositories/user.repository.interface";
import { NotFoundException } from "@nestjs/common";
import { User } from "@shared/types/user";

export class FindOneUserCommand implements Command<User> {
  constructor(
    private readonly id: string,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(): Promise<User> {
    console.log(`Executando FindOneUserCommand para ID: ${this.id}`);
    
    const user = await this.userRepository.findOne(this.id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${this.id} não encontrado`);
    }

    return user;
  }
}
