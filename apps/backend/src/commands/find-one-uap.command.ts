import { Command } from "../interfaces/command";
import { IUapRepository } from "../uaps/repositories/uap.repository.interface";
import { NotFoundException } from "@nestjs/common";
import { UAP } from "@shared/types/uap";

export class FindOneUapCommand implements Command<UAP> {
  constructor(
    private readonly id: string,
    private readonly uapRepository: IUapRepository
  ) {}

  async execute(): Promise<UAP> {
    console.log(`Executando FindOneUapCommand para ID: ${this.id}`);

    const uap = await this.uapRepository.findOne(this.id);

    if (!uap) {
      throw new NotFoundException(`UAP com ID ${this.id} não encontrado`);
    }

    return uap;
  }
}
