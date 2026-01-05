import type { ITradingSession } from "@/entities/TradingSession";
import type TradingSessionRepository from "../repositories/TradingSessionRepository";
import { handleApiError } from "../utils/handlerError";

export class TradingSessionService {
  constructor(private repository: TradingSessionRepository) {}

  async getStatus(): Promise<ITradingSession | null> {
    try {
      const status = (await this.repository.getStatus()).data;
      return status;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  async updateStatus(payload: ITradingSession): Promise<ITradingSession | null> {
    try {
      const status = (await this.repository.updateStatus(payload)).data;
      return status;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
}
