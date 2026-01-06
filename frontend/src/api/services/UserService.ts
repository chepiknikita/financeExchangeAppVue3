import type { IUser } from "@/entities/User";
import type UserRepository from "../repositories/UserRepository";
import { handleApiError } from "../utils/handlerError";

export class UserService {
  constructor(private repository: UserRepository) {}

  async getAll(): Promise<IUser[]> {
    try {
      const users = (await this.repository.getAll()).data;
      return users;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }

  async getById(id: number): Promise<IUser | null> {
    try {
      const user = (await this.repository.getById(id)).data;
      return user;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
}
