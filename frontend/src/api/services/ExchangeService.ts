import type { ExchangeInfo, ExchangeInfoEdit } from "../intarfaces/exchange";
import type ExchangeRepository from "../repositories/ExchangeRepository";

export class ExchangeService {
  constructor(private repository: ExchangeRepository) {}

  async getInfo(): Promise<ExchangeInfo[] | null> {
    try {
      const info = (await this.repository.getInfo()).data;
      return info;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async editInfo(payload: ExchangeInfoEdit): Promise<void> {
    try {
      await this.repository.editInfo(payload);
    } catch (error) {
      console.error(error);
    }
  }
}
