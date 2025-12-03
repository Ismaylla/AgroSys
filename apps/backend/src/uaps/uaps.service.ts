import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IUapRepository } from "./repositories/uap.repository.interface";
import { UAP_REPOSITORY } from "./repositories/uapToken";
import { CreateUapDto } from "@shared/dto/uap/create-uap.dto";
import { UpdateUapDto } from "@shared/dto/uap/update-uap.dto";
import { UAP } from "@shared/types/uap";
import { FindOneUapCommand } from "../commands/find-one-uap.command";

@Injectable()
export class UapsService {
  constructor(
    @Inject(UAP_REPOSITORY)
    private readonly repository: IUapRepository
  ) {}

  async create(dto: CreateUapDto): Promise<UAP> {
    return await this.repository.create(dto);
  }

  async findAll(): Promise<UAP[]> {
    return await this.repository.findAll();
  }

  async findOne(id: string): Promise<UAP> {
    const command = new FindOneUapCommand(id, this.repository);
    return command.execute();
  }

  async update(id: string, dto: UpdateUapDto): Promise<UAP> {
    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(
        `UAP com ID ${id} não encontrada para atualização`
      );
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const found = await this.repository.findOne(id);
    if (!found) {
      throw new NotFoundException(
        `UAP com ID ${id} não encontrada para exclusão`
      );
    }
    await this.repository.delete(id);
  }
}
