import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
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
