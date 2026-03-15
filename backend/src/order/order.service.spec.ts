import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderType } from './entities/order.entity';

const mockPrisma = {
  $transaction: jest.fn(),
  order: { create: jest.fn(), findMany: jest.fn() },
  user: { update: jest.fn() },
  asset: { update: jest.fn() },
  userAsset: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockUserService = { getById: jest.fn() };
const mockAssetService = { getById: jest.fn() };
const mockTradingSessionService = { getStatus: jest.fn() };
const mockWebSocketFacade = {
  broadcastOrderCreated: jest.fn(),
  broadcastAssetUpdate: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: 'PrismaService', useValue: mockPrisma },
        { provide: 'UserService', useValue: mockUserService },
        { provide: 'AssetService', useValue: mockAssetService },
        { provide: 'TradingSessionService', useValue: mockTradingSessionService },
        { provide: 'WebSocketFacadeService', useValue: mockWebSocketFacade },
      ],
    })
      .overrideProvider(OrderService)
      .useFactory({
        factory: () =>
          new OrderService(
            mockPrisma as any,
            mockUserService as any,
            mockAssetService as any,
            mockTradingSessionService as any,
            mockWebSocketFacade as any,
          ),
      })
      .compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  // --- create() ---

  it('throws BadRequestException when trading is stopped', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: false });

    await expect(
      service.create({ userId: 1, assetId: 1, type: OrderType.Buy, quantity: 1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when user not found', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue(null);

    await expect(
      service.create({ userId: 99, assetId: 1, type: OrderType.Buy, quantity: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when asset not found', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 1000 });
    mockAssetService.getById.mockResolvedValue(null);

    await expect(
      service.create({ userId: 1, assetId: 99, type: OrderType.Buy, quantity: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  // --- Buy order ---

  it('throws BadRequestException when balance is insufficient for buy', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 50 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 10 });

    await expect(
      service.create({ userId: 1, assetId: 1, type: OrderType.Buy, quantity: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when asset available quantity is insufficient for buy', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 10000 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 3 });

    await expect(
      service.create({ userId: 1, assetId: 1, type: OrderType.Buy, quantity: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('successfully creates buy order for new user asset', async () => {
    const order = { id: 1, userId: 1, assetId: 1, type: OrderType.Buy, quantity: 5, price: 100 };
    const updatedAsset = { id: 1, price: 100, availableQuantity: 5 };

    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 1000 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 10 });
    mockPrisma.$transaction.mockImplementation((fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma));
    mockPrisma.order.create.mockResolvedValue(order);
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.asset.update.mockResolvedValue(updatedAsset);
    mockPrisma.userAsset.findUnique.mockResolvedValue(null);
    mockPrisma.userAsset.create.mockResolvedValue({});
    mockWebSocketFacade.broadcastAssetUpdate.mockResolvedValue(undefined);
    mockWebSocketFacade.broadcastOrderCreated.mockResolvedValue(undefined);

    const result = await service.create({ userId: 1, assetId: 1, type: OrderType.Buy, quantity: 5 });

    expect(result).toEqual(order);
    expect(mockPrisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: OrderType.Buy, quantity: 5 }) }),
    );
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { currentBalance: { decrement: 500 } } }),
    );
  });

  // --- Sell order ---

  it('throws BadRequestException when user does not own the asset for sell', async () => {
    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 1000 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 10 });
    mockPrisma.userAsset.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ userId: 1, assetId: 1, type: OrderType.Sell, quantity: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('successfully creates sell order and increments user balance', async () => {
    const order = { id: 2, userId: 1, assetId: 1, type: OrderType.Sell, quantity: 3, price: 100 };
    const updatedAsset = { id: 1, price: 100, availableQuantity: 13 };

    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 500 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 10 });
    mockPrisma.userAsset.findUnique
      .mockResolvedValueOnce({ userId: 1, assetId: 1, quantity: 5, averageBuyPrice: 80 }) // sell check
      .mockResolvedValueOnce({ userId: 1, assetId: 1, quantity: 5, averageBuyPrice: 80 }); // inside tx
    mockPrisma.$transaction.mockImplementation((fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma));
    mockPrisma.order.create.mockResolvedValue(order);
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.asset.update.mockResolvedValue(updatedAsset);
    mockPrisma.userAsset.update.mockResolvedValue({});
    mockWebSocketFacade.broadcastAssetUpdate.mockResolvedValue(undefined);
    mockWebSocketFacade.broadcastOrderCreated.mockResolvedValue(undefined);

    const result = await service.create({ userId: 1, assetId: 1, type: OrderType.Sell, quantity: 3 });

    expect(result).toEqual(order);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { currentBalance: { increment: 300 } } }),
    );
  });

  it('deletes UserAsset record when all assets are sold', async () => {
    const order = { id: 3, userId: 1, assetId: 1, type: OrderType.Sell, quantity: 5, price: 100 };
    const updatedAsset = { id: 1, price: 100, availableQuantity: 15 };

    mockTradingSessionService.getStatus.mockResolvedValue({ isTrading: true });
    mockUserService.getById.mockResolvedValue({ id: 1, currentBalance: 500 });
    mockAssetService.getById.mockResolvedValue({ id: 1, price: 100, availableQuantity: 10 });
    mockPrisma.userAsset.findUnique
      .mockResolvedValueOnce({ userId: 1, assetId: 1, quantity: 5, averageBuyPrice: 80 }) // sell check
      .mockResolvedValueOnce({ userId: 1, assetId: 1, quantity: 5, averageBuyPrice: 80 }); // inside tx
    mockPrisma.$transaction.mockImplementation((fn: (tx: typeof mockPrisma) => Promise<unknown>) => fn(mockPrisma));
    mockPrisma.order.create.mockResolvedValue(order);
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.asset.update.mockResolvedValue(updatedAsset);
    mockPrisma.userAsset.delete.mockResolvedValue({});
    mockWebSocketFacade.broadcastAssetUpdate.mockResolvedValue(undefined);
    mockWebSocketFacade.broadcastOrderCreated.mockResolvedValue(undefined);

    await service.create({ userId: 1, assetId: 1, type: OrderType.Sell, quantity: 5 });

    expect(mockPrisma.userAsset.delete).toHaveBeenCalled();
    expect(mockPrisma.userAsset.update).not.toHaveBeenCalled();
  });

  // --- getAverageBuyPrice ---

  it('correctly calculates weighted average buy price on second purchase', () => {
    const existingUserAsset = { quantity: 10, averageBuyPrice: 100 } as any;
    // Buy 5 more at price 200: (10*100 + 5*200) / (10+5) = (1000+1000)/15 ≈ 133.33
    const result = (service as any).getAverageBuyPrice(existingUserAsset, 5, 200, OrderType.Buy);
    expect(result).toBeCloseTo(133.33, 1);
  });

  it('does not change average buy price on sell', () => {
    const existingUserAsset = { quantity: 10, averageBuyPrice: 150 } as any;
    const result = (service as any).getAverageBuyPrice(existingUserAsset, -3, 200, OrderType.Sell);
    expect(result).toBe(150);
  });
});
