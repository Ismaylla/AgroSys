import { Command } from "../interfaces/command";
import { IToolRepository } from "../tool/repositories/tool.repository.interface";
import { NotFoundException } from "@nestjs/common";
import { Tool } from "@prisma/client";

export class FindOneToolCommand implements Command<Tool> {
  constructor(
    private readonly id: string,
    private readonly toolRepository: IToolRepository
  ) {}

  async execute(): Promise<Tool> {
    console.log(`Executando FindOneToolCommand para ID: ${this.id}`);

    const tool = await this.toolRepository.findOne(this.id);

    if (!tool) {
      throw new NotFoundException(`Ferramenta com ID ${this.id} não encontrado`);
    }

    return tool;
  }
}
