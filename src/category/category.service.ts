import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { where } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCategoryInput) {
    try {
      let created = await this.prisma.category.create({ data });
      return created;
    } catch (error) {
      return error;
    }
  }

  async findAll(query: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    return this.prisma.category.findMany({
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
    try {
      let one = await this.prisma.category.findFirst({
        where: { id },
        include: { product: true },
      });
      return one;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, data: UpdateCategoryInput) {
    try {
      let one = await this.prisma.category.update({
        where: { id },
        data: data,
      });
      return one;
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      let one = await this.prisma.category.delete({
        where: { id },
      });
      return one;
    } catch (error) {
      return error;
    }
  }
}
