import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: CreateProductInput) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!existingCategory) {
        throw new Error('Kategoriya topilmadi');
      }

      const newProduct = await this.prisma.product.create({
        data: {
          name: data.name,
          category: {
            connect: { id: data.categoryId },
          },
        },
        select: {
          id: true,
          name: true,
          categoryid: true,
        },
      });

      return newProduct;
    } catch (error) {
      console.error('Xato:', error);
      throw new Error('Mahsulot yaratishda xatolik yuz berdi');
    }
  }

  async findAll(query: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    return this.prisma.product.findMany({
      where: name
        ? {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }
        : undefined,
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductInput,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
