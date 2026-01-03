export interface Asset {
  id: number;
  ticker: string;
  name: string;
  type: string;
  price: number;
  closingPrice: number;
  quantity: number;
  availableQuantity?: number;
  profit?: number;
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
  averageBuyPrice: number;
  quantity: number;
}

export interface AssetInfo extends Asset {
  totalProfit: number;
  averageBuyPrice: number;
  quantity: number;
}
