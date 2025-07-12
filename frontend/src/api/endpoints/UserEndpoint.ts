import type { AxiosInstance, AxiosResponse } from "axios";
import type { UserInfoEdit } from "../intarfaces/user";

export default class UserEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAll<T>(): Promise<AxiosResponse<T>> {
    return await this.api.get("users");
  }

  async getById<T>(id: number): Promise<AxiosResponse<T>> {
    return await this.api.get(`users/${id}`);
  }

  async update<T>(id: number, payload: UserInfoEdit): Promise<AxiosResponse<T>> {
    return await this.api.put(`users/${id}`, payload);
  }
}
