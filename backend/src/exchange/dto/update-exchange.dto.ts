import { IsBoolean, IsDateString, IsOptional } from '@nestjs/class-validator';
import { BadRequestException } from '@nestjs/common';

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

  async validateDates() {
    const now = new Date();

    if (this.end && new Date(this.end) < now) {
      throw new BadRequestException(
        'Дата окончания (end) не может быть в прошлом',
      );
    }

    if (this.start && this.end && new Date(this.start) > new Date(this.end)) {
      throw new BadRequestException(
        'Дата начала (start) не может быть позже даты окончания (end)',
      );
    }
  }
}
