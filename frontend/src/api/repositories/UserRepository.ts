import type { IUser } from "@/entities/User";
import type UserEndpoint from "../endpoints/UserEndpoint";
import type { AxiosResponse } from "axios";

export default class UserRepository {
  api: UserEndpoint;

  constructor(api: UserEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<IUser[]>> {
    return this.api.getAll<IUser[]>();
  }

  async getById(id: number): Promise<AxiosResponse<IUser>> {
    return this.api.getById<IUser>(id);
  }
}
