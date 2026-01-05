import type { AxiosResponse } from "axios";
import type TradingSessionEndpoint from "../endpoints/TradingSessionEndpoint";
import type { ITradingSession } from "@/entities/TradingSession";

export default class TradingSessionRepository {
  api: TradingSessionEndpoint;

  constructor(api: TradingSessionEndpoint) {
    this.api = api;
  }

  async getStatus(): Promise<AxiosResponse<ITradingSession>> {
    return this.api.getStatus<ITradingSession>();
  }

  async updateStatus(payload: ITradingSession): Promise<AxiosResponse<ITradingSession>> {
    return this.api.updateStatus<ITradingSession>(payload);
  }
}
