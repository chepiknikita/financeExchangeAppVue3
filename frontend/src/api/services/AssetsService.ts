import type { Asset, PriceHistory, UserAsset } from "../intarfaces/asset";
import type AssetsRepository from "../repositories/AssetsRepository";

export class AssetsService {
  constructor(private repository: AssetsRepository) {}

  async getAll(): Promise<Asset[]> {
    try {
      const assets = (await this.repository.getAll()).data;
      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: number): Promise<Asset | null> {
    try {
      const asset = (await this.repository.getById(id)).data;
      return asset;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAssetHistory(id: number): Promise<PriceHistory[]> {
    try {
      const asset = (await this.repository.getAssetHistory(id)).data;
      return asset;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getUserPortfolio(userId: number): Promise<UserAsset[]> {
    try {
      const assets = (await this.repository.getUserPortfolio(userId)).data;
      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
