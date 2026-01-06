import { Controller, Get, Body, Patch } from '@nestjs/common';
import { TradingSessionService } from './tradingSession.service';
import { UpdateTradingSessionDto } from './dto/update-trading-session.dto';

@Controller('tradingSession')
export class TradingSessionController {
  constructor(private readonly tradingSessionService: TradingSessionService) {}

  @Get('status')
  getStatus() {
    return this.tradingSessionService.getStatus();
  }

  @Patch()
  updateStatus(@Body() updateTradingSessionDto: UpdateTradingSessionDto) {
    return this.tradingSessionService.updateStatus(updateTradingSessionDto);
  }
}
