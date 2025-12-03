import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IToolRepository } from "./repositories/tool.repository.interface";
import { TOOL_REPOSITORY } from "./repositories/toolToken";
import { CreateToolDto } from "@shared/dto/tool/create-tool.dto";
import { UpdateToolDto } from "@shared/dto/tool/update-tool.dto";
import { EStatusTool, EToolName } from "@shared/enums/tool.enum";
import { Tool } from "@prisma/client";
import { FindOneToolCommand } from "../commands/find-one-tool.command";

@Injectable()
export class ToolService {
  constructor(
    @Inject(TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository
  ) {}

  async findOne(id: string): Promise<Tool> {
      const command = new FindOneToolCommand(id, this.toolRepository);
      return command.execute();
  }

  async findAll(): Promise<Tool[]> {
    return this.toolRepository.findAll();
  }

  async create(createToolDto: CreateToolDto): Promise<Tool> {
    return this.toolRepository.create(createToolDto);
  }

  async update(id: string, data: UpdateToolDto): Promise<Tool> {
    const tool = await this.toolRepository.update(id, data);
    if (!tool) {
      throw new NotFoundException(`Ferramenta com código ${id} não encontrada`);
    }
    return tool;
  }

  async delete(id: string): Promise<void> {
    const tool = await this.toolRepository.findOne(id);
    if (!tool) {
      throw new NotFoundException(
        `Ferramenta com o código ${id} não encontrada`
      );
    }
    await this.toolRepository.delete(id);
  }

  async findByStatus(status: EStatusTool): Promise<Tool[]> {
    return this.toolRepository.findByStatus(status);
  }

  async findByToolName(toolName: EToolName): Promise<Tool[]> {
    return this.toolRepository.findByToolName(toolName);
  }
}
