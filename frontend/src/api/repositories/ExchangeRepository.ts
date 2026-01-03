import type { ExchangeInfo } from "../intarfaces/exchange";
import type ExchangeEndpoint from "../endpoints/ExchangeEndpoint";
import type { AxiosResponse } from "axios";

export default class ExchangeRepository {
  api: ExchangeEndpoint;

  constructor(api: ExchangeEndpoint) {
    this.api = api;
  }

  async getStatus(): Promise<AxiosResponse<ExchangeInfo>> {
    return this.api.getStatus<ExchangeInfo>();
  }

  async updateStatus(
    payload: ExchangeInfo
  ): Promise<AxiosResponse<ExchangeInfo>> {
    return this.api.updateStatus<ExchangeInfo>(payload);
  }
}
