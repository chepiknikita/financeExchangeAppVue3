import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(ThrottlerGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(':id')
  getUserOrders(@Param('id') id: number) {
    return this.orderService.getUserOrders(id);
  }

  @Get()
  getAll() {
    return this.orderService.getAll();
  }
}
