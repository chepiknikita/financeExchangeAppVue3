import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AssetService } from './asset.service';

const mockPrisma = {
  $transaction: jest.fn(),
  asset: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  priceHistory: { create: jest.fn() },
  userAsset: { findMany: jest.fn() },
  tradingSession: { findFirst: jest.fn() },
};

const mockWebSocketFacade = {
  broadcastAssetUpdate: jest.fn(),
  broadcastAssetsUpdate: jest.fn(),
};

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetService],
    })
      .overrideProvider(AssetService)
      .useFactory({
        factory: () =>
          new AssetService(mockPrisma as any, mockWebSocketFacade as any),
      })
      .compile();

    service = module.get<AssetService>(AssetService);
    jest.clearAllMocks();
  });

  // --- getEntityById ---

  it('throws NotFoundException when asset does not exist', async () => {
    mockPrisma.asset.findUnique.mockResolvedValue(null);

    await expect(service.getEntityById(999)).rejects.toThrow(NotFoundException);
  });

  // --- updateAssetPrices ---

  it('skips price update when trading session is not active', async () => {
    mockPrisma.asset.findMany.mockResolvedValue([
      { id: 1, price: 100 },
      { id: 2, price: 200 },
    ]);
    mockPrisma.tradingSession.findFirst.mockResolvedValue({ isTrading: false });

    await service.updateAssetPrices();

    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  // --- updateAssetPrice (single) ---

  it('updates asset price, creates price history record, and broadcasts', async () => {
    const asset = { id: 1, price: 100 };
    const updatedAsset = { id: 1, price: 150 };
    const priceHistoryRecord = { id: 10, assetId: 1, price: 150 };

    mockPrisma.asset.findUnique.mockResolvedValue(asset);
    mockPrisma.$transaction.mockImplementation((fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma));
    mockPrisma.asset.update.mockResolvedValue(updatedAsset);
    mockPrisma.priceHistory.create.mockResolvedValue(priceHistoryRecord);
    mockWebSocketFacade.broadcastAssetUpdate.mockResolvedValue(undefined);

    const result = await service.updateAssetPrice(1, 150);

    expect(result).toEqual(updatedAsset);
    expect(mockPrisma.priceHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { assetId: 1, price: 150 } }),
    );
    expect(mockWebSocketFacade.broadcastAssetUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ assetId: 1, asset: updatedAsset }),
    );
  });

  // --- updateClosingPrices ---

  it('updates closing price for each asset and broadcasts', async () => {
    const assets = [
      { id: 1, price: 150 },
      { id: 2, price: 300 },
    ];
    mockPrisma.asset.findMany.mockResolvedValue(assets);
    mockPrisma.asset.update.mockResolvedValue({});
    mockWebSocketFacade.broadcastAssetsUpdate.mockResolvedValue(undefined);

    await service.updateClosingPrices();

    expect(mockPrisma.asset.update).toHaveBeenCalledTimes(2);
    expect(mockPrisma.asset.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { closingPrice: 150 } }),
    );
    expect(mockPrisma.asset.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { closingPrice: 300 } }),
    );
    expect(mockWebSocketFacade.broadcastAssetsUpdate).toHaveBeenCalled();
  });
});
