import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TradingSessionService } from './tradingSession.service';

const mockPrisma = {
  tradingSession: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockAssetService = { updateClosingPrices: jest.fn(), updateAssetPrices: jest.fn() };
const mockWebSocketFacade = { broadcastTradingSessionStatus: jest.fn() };

describe('TradingSessionService', () => {
  let service: TradingSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingSessionService],
    })
      .overrideProvider(TradingSessionService)
      .useFactory({
        factory: () =>
          new TradingSessionService(
            mockPrisma as any,
            mockAssetService as any,
            mockWebSocketFacade as any,
          ),
      })
      .compile();

    service = module.get<TradingSessionService>(TradingSessionService);
    jest.clearAllMocks();
  });

  // --- validateDates ---

  it('throws BadRequestException when end date is in the past', () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    expect(() => (service as any).validateDates({ end: past })).toThrow(BadRequestException);
  });

  it('throws BadRequestException when start date is later than end date', () => {
    const now = new Date();
    const start = new Date(now.getTime() + 120_000).toISOString();
    const end = new Date(now.getTime() + 60_000).toISOString();
    expect(() => (service as any).validateDates({ start, end })).toThrow(BadRequestException);
  });

  // --- updateStatus ---

  it('calls updateClosingPrices when isTrading is set to false', async () => {
    const session = { id: 1, isTrading: true, start: new Date(), end: new Date() };
    const updated = { ...session, isTrading: false };

    mockPrisma.tradingSession.findFirst.mockResolvedValue(session);
    mockPrisma.tradingSession.update.mockResolvedValue(updated);
    mockAssetService.updateClosingPrices.mockResolvedValue(undefined);
    mockWebSocketFacade.broadcastTradingSessionStatus.mockResolvedValue(undefined);

    await service.updateStatus({ isTrading: false });

    expect(mockAssetService.updateClosingPrices).toHaveBeenCalled();
  });

  it('does not call updateClosingPrices when isTrading is set to true', async () => {
    const session = { id: 1, isTrading: false, start: new Date(), end: new Date() };
    const updated = { ...session, isTrading: true };

    mockPrisma.tradingSession.findFirst.mockResolvedValue(session);
    mockPrisma.tradingSession.update.mockResolvedValue(updated);
    mockWebSocketFacade.broadcastTradingSessionStatus.mockResolvedValue(undefined);

    await service.updateStatus({ isTrading: true });

    expect(mockAssetService.updateClosingPrices).not.toHaveBeenCalled();
  });

  // --- updateAssetPrices (cron) ---

  it('does not update asset prices when trading is stopped', async () => {
    mockPrisma.tradingSession.findFirst.mockResolvedValue({ id: 1, isTrading: false });

    await service.updateAssetPrices();

    expect(mockAssetService.updateAssetPrices).not.toHaveBeenCalled();
  });

  it('calls updateAssetPrices when trading is active', async () => {
    mockPrisma.tradingSession.findFirst.mockResolvedValue({ id: 1, isTrading: true });
    mockAssetService.updateAssetPrices.mockResolvedValue(undefined);

    await service.updateAssetPrices();

    expect(mockAssetService.updateAssetPrices).toHaveBeenCalled();
  });

  // --- getStatus ---

  it('creates a new trading session when none exists', async () => {
    const newSession = { id: 1, isTrading: false, start: new Date(), end: null };
    mockPrisma.tradingSession.findFirst.mockResolvedValue(null);
    mockPrisma.tradingSession.create.mockResolvedValue(newSession);

    const result = await service.getStatus();

    expect(mockPrisma.tradingSession.create).toHaveBeenCalled();
    expect(result).toEqual(newSession);
  });
});
