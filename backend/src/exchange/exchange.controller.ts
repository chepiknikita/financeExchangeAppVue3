import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { UpdateExchangeDto } from './dto/update-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('/info')
  async getInfo() {
    return await this.exchangeService.getInfo();
  }

  @Put('/info')
  async updateInfo(
    @Param('id') id: string,
    @Body() updateExchangeDto: UpdateExchangeDto,
  ) {
    return await this.exchangeService.updateInfo(+id, updateExchangeDto);
  }
}
