import type { ITradingSession } from "@/entities/TradingSession";
import type { AxiosInstance, AxiosResponse } from "axios";

export default class TradingSessionEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getStatus<T>(): Promise<AxiosResponse<T>> {
    return this.api.get("tradingSession/status");
  }

  async updateStatus<T>(payload: ITradingSession): Promise<AxiosResponse<T>> {
    return this.api.patch("tradingSession", payload);
  }
}
