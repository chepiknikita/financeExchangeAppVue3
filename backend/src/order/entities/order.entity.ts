export class Order {
  id: number;
  userId: number;
  assetId: number;
  type: OrderType;
  quantity: number;
  price: number;
  createdAt: Date;
  executedAt: Date | null;
}

export const enum OrderType {
  Buy = 'BUY',
  Sell = 'SELL',
}
