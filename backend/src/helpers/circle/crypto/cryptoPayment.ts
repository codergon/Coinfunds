import { AxiosInstance } from "axios";
import {
  CreatePaymentIntentPayload,
  PaymentIntent,
  PaymentIntentsQueryParams,
  CryptoRefundPayment,
  RefundPaymentIntentPayLoad,
  SubscriptionData,
} from "./interface";

export class CircleCryptoPayment {
  circleAPI: AxiosInstance;
  constructor(circleAPI: AxiosInstance) {
    this.circleAPI = circleAPI;
  }

  getSupportedCurrenciesAndChains() {
    return {
      USDC: ["ALGO", "AVAX", "ETH", "MATIC", "SOL", "TRX"],
      BTC: ["BTC"],
      ETH: ["ETH"],
    };
  }

  async createPaymenIntent(payload: CreatePaymentIntentPayload) {
    const data = await this.circleAPI.post<PaymentIntent>(
      "/v1/paymentIntents",
      payload
    );
    return data.data;
  }

  async getAllPaymentIntents(queryParams?: PaymentIntentsQueryParams) {
    const data = await this.circleAPI.get<PaymentIntent[]>(
      "/v1/paymentIntents",
      {
        params: queryParams,
      }
    );
    return data.data.map((intentData) => intentData);
  }

  async getPaymentIntentById(id: string) {
    const data = await this.circleAPI.get<PaymentIntent>(
      `/v1/paymentIntents/${id}`
    );
    return data.data;
  }

  async expirePaymentIntentById(id: string) {
    const data = await this.circleAPI.post<PaymentIntent>(
      `v1/paymentIntents/${id}/expire`
    );
    return data.data;
  }

  async refundPaymentById(id: string, payload: RefundPaymentIntentPayLoad) {
    const data = await this.circleAPI.post<CryptoRefundPayment>(
      `/v1/paymentIntents/${id}/refund`,
      payload
    );
    return data.data;
  }

  async getExchangeRate(tradingPair: "BTC-USD" | "ETH-USD") {
    const data = await this.circleAPI.get<{ buy: string; sell: string }>(
      `v1/exchange/rates/${tradingPair}`
    );
    return data.data;
  }

  async createSubscription(url: string) {
    const data = await this.circleAPI.post<SubscriptionData>(
      `/v1/notifications/subscriptions`,
      {
        endpoint: url,
      }
    );
    return data.data;
  }
  async getSubscriptions() {
    const data = await this.circleAPI.get<SubscriptionData[]>(
      `/v1/notifications/subscriptions`
    );
    return data.data;
  }
  async removeSubcsription(id: string) {
    const data = await this.circleAPI.delete<SubscriptionData[]>(
      `/v1/notifications/subscriptions/${id}`
    );
    return data.data;
  }
}
