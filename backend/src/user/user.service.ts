import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async updateBalance(userId: number, amount: number): Promise<User> {
    const user = await this.getById(userId);
    const newBalance = user.balance + amount;

    if (newBalance < 0) {
      throw new Error('Insufficient funds');
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { balance: newBalance },
    });
  }
}
