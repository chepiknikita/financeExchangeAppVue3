import type { AxiosInstance, AxiosResponse } from "axios";
import type { ExchangeInfo } from "../intarfaces/exchange";

export default class ExchangeEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getStatus<T>(): Promise<AxiosResponse<T>> {
    return this.api.get("exchange/status");
  }

  async updateStatus<T>(payload: ExchangeInfo): Promise<AxiosResponse<T>> {
    return this.api.patch("exchange", payload);
  }
}
