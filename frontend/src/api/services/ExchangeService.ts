import type { ExchangeInfo } from "../intarfaces/exchange";
import type ExchangeRepository from "../repositories/ExchangeRepository";

export class ExchangeService {
  constructor(private repository: ExchangeRepository) {}

  async getStatus(): Promise<ExchangeInfo | null> {
    try {
      const status = (await this.repository.getStatus()).data;
      return status;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateStatus(payload: ExchangeInfo): Promise<ExchangeInfo | null> {
    try {
      const status = (await this.repository.updateStatus(payload)).data;
      return status;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
