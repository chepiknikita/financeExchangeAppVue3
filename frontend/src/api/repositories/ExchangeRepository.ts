import type { ExchangeInfo, ExchangeInfoEdit } from "../intarfaces/exchange";
import type ExchangeEndpoint from "../endpoints/ExchangeEndpoint";
import type { AxiosResponse } from "axios";

export default class ExchangeRepository {
  api: ExchangeEndpoint;

  constructor(api: ExchangeEndpoint) {
    this.api = api;
  }

  async getInfo(): Promise<AxiosResponse<ExchangeInfo[]>> {
    return this.api.getInfo<ExchangeInfo[]>();
  }

  async editInfo(payload: ExchangeInfoEdit): Promise<AxiosResponse<void>> {
    return this.api.editInfo<void>(payload);
  }
}
