import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IProductRepository } from "./repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "./repositories/productToken";
import { CreateProductDto } from "@shared/dto/product/create-product.dto";
import { UpdateProductDto } from "@shared/dto/product/update-product.dto";
import { Product } from "@shared/types/product";
import { EProductStatus } from "@shared/enums/product.enum";
import { FindOneProductCommand } from "../commands/find-one-product.command";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.create(createProductDto);
  }

  // MÉTODO findAll() ANTIGO REMOVIDO E SUBSTITUÍDO POR findAllPaginated
  
  async findAllPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;

    // 1. Assumimos que o repositório retornará [produtos, totalCount]
    // O erro de compilação será resolvido quando a Interface for atualizada.
    const [products, total] = await this.productRepository.findAndCount({
      limit,
      offset,
    });

    // 2. Calcula o total de páginas
    const totalPages = Math.ceil(total / limit);

    // 3. Retorna o formato { data, meta } que o Frontend espera (B3)
    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  // O método findAll() antigo não é mais utilizado para a listagem principal, 
  // mas pode ser mantido se necessário em outras partes do sistema.
  // async findAll(): Promise<Product[]> {
  //   return await this.productRepository.findAll();
  // }
  

  async findOne(id: string): Promise<Product> {
    const command = new FindOneProductCommand(id, this.productRepository);
    return command.execute();
  }

  async findByStatus(status: EProductStatus): Promise<Product[]> {
    return await this.productRepository.findByStatus(status);
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.productRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    await this.productRepository.delete(id);
  }

  async updateQuantity(id: string, quantity: number): Promise<Product> {
    return await this.update(
      id,
      new UpdateProductDto(undefined, undefined, undefined, quantity)
    );
  }

  async decreaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    const newQuantity = Math.max(0, product.quantity - quantity);
    return await this.updateQuantity(id, newQuantity);
  }

  async increaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    const newQuantity = product.quantity + quantity;
    return await this.updateQuantity(id, newQuantity);
  }
}
