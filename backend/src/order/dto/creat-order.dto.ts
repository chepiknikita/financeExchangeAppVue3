import { IsEnum, IsInt, IsPositive } from '@nestjs/class-validator';
import { OrderType } from '@prisma/client';

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsInt()
  assetId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsInt()
  @IsPositive()
  quantity: number;
}