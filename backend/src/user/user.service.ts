import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        assets: {
          include: {
            asset: {
              select: {
                ticker: true,
                name: true,
                type: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
}
