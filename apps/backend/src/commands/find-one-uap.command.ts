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
    const uap = await this.uapRepository.findOne(this.id);

    if (!uap) {
      throw new NotFoundException(`UAP com ID ${this.id} não encontrado`);
    }

    return uap;
  }
}
