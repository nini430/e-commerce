import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(
    name: string,
    price: number,
    description: string,
  ): Promise<ProductDocument> {
    const newProduct = new this.productModel({ name, price, description });
    return newProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find({}).exec();
  }

  async find(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    newName: string,
    newPrice: number,
    newDescription: string,
  ) {
    const product = await this.find(id);
    if (!product) {
      throw new ForbiddenException('Product not found');
    }

    product.name = newName ?? product.name;
    product.price = newPrice ?? product.price;
    product.description = newDescription ?? product.description;

    return product.save();
  }

  async remove(id: string) {
    return this.productModel.deleteOne({ _id: id });
  }
}
