export interface Asset {
  id: number;
  ticker: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
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
  asset: Asset;
  quantity: number;
}
