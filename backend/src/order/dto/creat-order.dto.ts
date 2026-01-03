import { IsEnum, IsInt, IsPositive, Max, Min } from '@nestjs/class-validator';
import { OrderType } from 'generated/prisma';

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsInt()
  assetId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(1000) 
  quantity: number;
}