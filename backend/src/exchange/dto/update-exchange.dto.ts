import { IsBoolean, IsDateString, IsOptional } from '@nestjs/class-validator';

export class UpdateExchangeDto {
  @IsOptional()
  @IsDateString()
  start?: Date;

  @IsOptional()
  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsBoolean()
  isTrading?: boolean;
}
