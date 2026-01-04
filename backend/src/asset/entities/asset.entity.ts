export interface Asset {
  id: number;
  ticker: string;
  name: string;
  type: AssetType | string;
  price: number;
  closingPrice: number;
  quantity: number;
  availableQuantity: number;
  history?: PriceHistory[];
}

export interface PriceHistory {
  id: number;
  assetId: number;
  price: number;
  timestamp: Date;
}

export interface UserAsset {
  id: number;
  userId: number;
  assetId: number;
  asset?: Asset;
  averageBuyPrice: number;
  quantity: number;
}

enum AssetType {
  Stock = 'stock',
  Metal = 'metal',
}
