import type { User, UserInfoEdit } from "../intarfaces/user";
import type UserRepository from "../repositories/UserRepository";

export class UserService {
  constructor(private repository: UserRepository) {}

  async getAll(): Promise<User[]> {
    try {
      const users = (await this.repository.getAll()).data;
      return users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      const user = (await this.repository.getById(id)).data;
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: number, payload: UserInfoEdit): Promise<void> {
    try {
      await this.repository.update(id, payload);
    } catch (error) {
      console.error(error);
    }
  }
}
