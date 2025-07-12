import { Injectable } from '@nestjs/common';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExchangeService {
  constructor(private prisma: PrismaService) {}

  async getInfo() {
    return await this.prisma.exchange.findMany();
  }

  async updateInfo(id: number, updateExchangeDto: UpdateExchangeDto) {
    return await this.prisma.exchange.update({
      where: { id },
      data: {
        start: new Date(updateExchangeDto.start),
        end: new Date(updateExchangeDto.end),
      },
    });
  }
}
