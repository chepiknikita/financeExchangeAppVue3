export interface Asset {
  id: number;
  ticker: string;
  name: string;
  type: AssetType | string;
  price: number;
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
  quantity: number;
}

enum AssetType {
  Stock = 'stock',
  Bond = 'bond',
  Metal = 'metal',
}
