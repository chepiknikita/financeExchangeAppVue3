import type AssetsRepository from "../repositories/AssetsRepository";
import type { IAsset, PriceHistory } from "@/entities/Asset";
import type { UserAsset } from "@/entities/User";
import { handleApiError } from "../utils/handlerError";

export class AssetsService {
  constructor(private repository: AssetsRepository) {}

  async getAll(): Promise<IAsset[]> {
    try {
      const assets = (await this.repository.getAll()).data;
      return assets;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }

  async getById(id: number): Promise<IAsset | null> {
    try {
      const asset = (await this.repository.getById(id)).data;
      return asset;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  async getAssetHistory(id: number): Promise<PriceHistory[]> {
    try {
      const asset = (await this.repository.getAssetHistory(id)).data;
      return asset;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }

  async getUserPortfolio(userId: number): Promise<UserAsset[]> {
    try {
      const assets = (await this.repository.getUserPortfolio(userId)).data;
      return assets;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }
}
