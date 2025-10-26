
export class Order {
  id: number;
  userId: number;
  assetId: number;
  type: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: Date;
  executedAt: Date | null;
}