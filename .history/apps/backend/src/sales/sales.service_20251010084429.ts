import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ISaleRepository } from "./repositories/sale.repository.interface";
import { SALE_REPOSITORY } from "./repositories/saleToken";
import { CreateSaleDto } from "@shared/dto/sale/create-sale.dto";
import { UpdateSaleDto } from "@shared/dto/sale/update-sale.dto";
import { SaleWithItems } from "@shared/types/product";
import { ESaleStatus } from "@shared/enums/product.enum";
import { ProductsService } from "../products/products.service";

@Injectable()
export class SalesService {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    private readonly productsService: ProductsService
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<SaleWithItems> {
    // Validar se todos os produtos existem e têm estoque suficiente
    for (const item of createSaleDto.items) {
      const product = await this.productsService.findOne(item.productId);

      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.quantity}, Solicitado: ${item.quantity}`
        );
      }
    }

    // Criar a venda
    const sale = await this.saleRepository.create(createSaleDto);

    // Atualizar estoque dos produtos (apenas para vendas concluídas)
    if (createSaleDto.status === ESaleStatus.COMPLETED) {
      await this.updateProductsStock(createSaleDto.items, "decrease");
    }

    return sale;
  }

  async findAllPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const[sales, total] = await this.saleRepository.findAndCount({
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return{
      data: sales,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
  // async findAll(): Promise<SaleWithItems[]> {
  //   return await this.saleRepository.findAll();
  // }

  async findOne(id: string): Promise<SaleWithItems> {
    const sale = await this.saleRepository.findOne(id);
    if (!sale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
    return sale;
  }

  async findByUapId(uapId: string): Promise<SaleWithItems[]> {
    return await this.saleRepository.findByUapId(uapId);
  }

  async findByStatus(status: ESaleStatus): Promise<SaleWithItems[]> {
    return await this.saleRepository.findByStatus(status);
  }

  async update(
    id: string,
    updateSaleDto: UpdateSaleDto
  ): Promise<SaleWithItems> {
    const existingSale = await this.findOne(id);

    // Se mudando para COMPLETED, verificar e atualizar estoque
    if (
      updateSaleDto.status === ESaleStatus.COMPLETED &&
      existingSale.status !== ESaleStatus.COMPLETED
    ) {
      await this.updateProductsStock(existingSale.saleItems, "decrease");
    }

    // Se mudando para CANCELLED de COMPLETED, reverter estoque
    if (
      updateSaleDto.status === ESaleStatus.CANCELLED &&
      existingSale.status === ESaleStatus.COMPLETED
    ) {
      await this.updateProductsStock(existingSale.saleItems, "increase");
    }

    const sale = await this.saleRepository.update(id, updateSaleDto);
    if (!sale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
    return sale;
  }

  async remove(id: string): Promise<void> {
    const sale = await this.findOne(id);

    // Se a venda estava concluída, reverter estoque
    if (sale.status === ESaleStatus.COMPLETED) {
      await this.updateProductsStock(sale.saleItems, "increase");
    }

    await this.saleRepository.delete(id);
  }

  async completeSale(id: string): Promise<SaleWithItems> {
    return await this.update(id, new UpdateSaleDto(ESaleStatus.COMPLETED));
  }

  async cancelSale(id: string): Promise<SaleWithItems> {
    return await this.update(id, new UpdateSaleDto(ESaleStatus.CANCELLED));
  }

  private async updateProductsStock(
    items: Array<{ productId: string; quantity: number }>,
    operation: "increase" | "decrease"
  ): Promise<void> {
    for (const item of items) {
      if (operation === "decrease") {
        await this.productsService.decreaseStock(item.productId, item.quantity);
      } else {
        await this.productsService.increaseStock(item.productId, item.quantity);
      }
    }
  }
}
