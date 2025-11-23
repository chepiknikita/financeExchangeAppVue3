import { Controller, Get, Param } from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset, PriceHistory, UserAsset } from './entities/asset.entity';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async getAll(): Promise<Asset[]> {
    return await this.assetService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Asset> {
    return await this.assetService.getById(+id);
  }

  @Get(':id/history')
  async getAssetHistory(@Param('id') id: string): Promise<PriceHistory[]> {
    return await this.assetService.getAssetHistory(+id);
  }

  @Get('/portfolio/:userId')
  async getUserPortfolio(
    @Param('userId') userId: string,
  ): Promise<UserAsset[]> {
    return await this.assetService.getUserPortfolio(+userId);
  }
}
