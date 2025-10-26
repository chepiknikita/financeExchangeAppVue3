import { Controller, Get, Body, Put, Param, Patch } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { UpdateExchangeDto } from './dto/update-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('status')
  getStatus() {
    return this.exchangeService.getExchangeStatus();
  }

  @Patch()
  updateStatus(@Body() updateExchangeDto: UpdateExchangeDto) {
    return this.exchangeService.updateExchangeStatus(updateExchangeDto);
  }

  @Patch('start')
  startTrading() {
    return this.exchangeService.startTrading();
  }

  @Patch('stop')
  stopTrading() {
    return this.exchangeService.stopTrading();
  }
}
