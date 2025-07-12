import type { AxiosInstance, AxiosResponse } from "axios";
import type { ExchangeInfoEdit } from "../intarfaces/exchange";

export default class ExchangeEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getInfo<T>(): Promise<AxiosResponse<T>> {
    return this.api.get("exchange/info");
  }

  async editInfo<T>(payload: ExchangeInfoEdit): Promise<AxiosResponse<T>> {
    return this.api.put("exchange/info", payload);
  }
}
