import type { User } from "../intarfaces/user";
import type UserEndpoint from "../endpoints/UserEndpoint";
import type { AxiosResponse } from "axios";

export default class UserRepository {
  api: UserEndpoint;

  constructor(api: UserEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<User[]>> {
    return this.api.getAll<User[]>();
  }

  async getById(id: number): Promise<AxiosResponse<User>> {
    return this.api.getById<User>(id);
  }
}
