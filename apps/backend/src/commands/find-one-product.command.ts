import { Command } from "../interfaces/command";
import { IProductRepository } from "../products/repositories/product.repository.interface";
import { NotFoundException } from "@nestjs/common";
import { Product } from "@shared/types/product";

export class FindOneProductCommand implements Command<Product> {
  constructor(
    private readonly id: string,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(): Promise<Product> {
    const product = await this.productRepository.findOne(this.id);

    if (!product) {
      throw new NotFoundException(`Produto com ID ${this.id} não encontrado`);
    }

    return product;
  }
}
