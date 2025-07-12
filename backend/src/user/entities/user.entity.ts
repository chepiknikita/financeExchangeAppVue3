import { Asset } from "src/asset/entities/asset.entity";

export interface User {
  id: number;
  login: string;
  name: string;
  balance: number;
  role: UserRole | string;
  assets?: Asset[];
}

enum UserRole {
  Admin = 'admin',
  User = 'user',
}
