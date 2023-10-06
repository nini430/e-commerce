import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDocument } from './product.schema';

@Controller('product')
export class ProductController {
  constructor(private produtService: ProductService) {}

  @Post()
  async createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ): Promise<ProductDocument> {
    return this.produtService.create(name, price, description);
  }

  @Get()
  async findAllProducts(): Promise<ProductDocument[]> {
    return this.produtService.findAll();
  }

  @Get(':id')
  async findProductById(@Param('id') id: string): Promise<ProductDocument> {
    return this.produtService.find(id);
  }

  @Patch(':id')
  async updateProductById(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string,
  ) {
    return this.produtService.update(id, name, price, description);
  }

  @Delete(':id')
  async removeProductById(@Param('id') id: string) {
    return this.produtService.remove(id);
  }
}
