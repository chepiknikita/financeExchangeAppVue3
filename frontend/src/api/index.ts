import type { AxiosInstance } from "axios";
import ApiClient from "./config/ApiClient";
import UserEndpoint from "./endpoints/UserEndpoint";
import UserRepository from "./repositories/UserRepository";
import { UserService } from "./services/UserService";
import AssetsRepository from "./repositories/AssetsRepository";
import AssetsEndpoint from "./endpoints/AssetsEndpoint";
import { AssetsService } from "./services/AssetsService";
import { TradingSessionService } from "./services/TradingSessionService";
import TradingSessionRepository from "./repositories/TradingSessionRepository";
import TradingSessionEndpoint from "./endpoints/TradingSessionEndpoint";
import OrderEndpoint from "./endpoints/OrderEndpoint";
import OrderRepository from "./repositories/OrderRepository";
import { OrderService } from "./services/OrderService";
import { WebSocketService } from "./services/WebSocketService";

const API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:8080";

export class ApiFactory {
  private static apiClient: AxiosInstance;
  private static userService: UserService;
  private static assetsService: AssetsService;
  private static tradingSessionService: TradingSessionService;
  private static orderService: OrderService;

  private static initialize() {
    if (!this.apiClient) {
      this.apiClient = new ApiClient(API_URL).api;
    }
  }

  public static createUserService(): UserService {
    this.initialize();
    if (!this.userService) {
      this.userService = new UserService(new UserRepository(new UserEndpoint(this.apiClient)));
    }
    return this.userService;
  }

  public static createAssetsService(): AssetsService {
    this.initialize();
    if (!this.assetsService) {
      this.assetsService = new AssetsService(new AssetsRepository(new AssetsEndpoint(this.apiClient)));
    }
    return this.assetsService;
  }

  public static createTradingSessionService(): TradingSessionService {
    this.initialize();
    if (!this.tradingSessionService) {
      this.tradingSessionService = new TradingSessionService(
        new TradingSessionRepository(new TradingSessionEndpoint(this.apiClient))
      );
    }
    return this.tradingSessionService;
  }

  public static createOrderService(): OrderService {
    this.initialize();
    if (!this.orderService) {
      this.orderService = new OrderService(new OrderRepository(new OrderEndpoint(this.apiClient)));
    }
    return this.orderService;
  }

  public static createWebSocketService(): WebSocketService {
    return WebSocketService.getInstance();
  }
}
