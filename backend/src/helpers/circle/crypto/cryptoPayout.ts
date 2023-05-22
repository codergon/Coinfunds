import { AxiosInstance } from "axios";
import {
  CreatePaymentIntentPayload,
  RecipientsQueryParams,
  RefundPaymentIntentPayLoad,
  CreatePayoutPayload,
  CreateRecipientPayload,
  PayoutQueryParams,
  PayoutRecipient,
  CryptoPayout,
} from "./interface";

export class CircleCryptoPayout {
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

  getSupportedSourceToDestinfation() {
    return {
      BTC: ["USDC"],
      USDC: ["BTC", "ETH"],
      ETH: ["USDC"],
    };
  }

  async getMasterWalletId() {
    const data = await this.circleAPI.get<{
      payments: { masterWalletId: string };
    }>("v1/configuration");
    return data.data.payments.masterWalletId;
  }

  async createRecipient(payload: CreateRecipientPayload) {
    const data = await this.circleAPI.post<PayoutRecipient>(
      "/v1/addressBook/recipients",
      payload
    );
    return data.data;
  }

  async getAllRecipients(queryParams: RecipientsQueryParams) {
    const data = await this.circleAPI.get<PayoutRecipient[]>(
      "v1/addressBook/recipients",
      {
        params: queryParams,
      }
    );
    return data.data;
  }

  async getRecipientById(id: string) {
    const data = await this.circleAPI.get<PayoutRecipient>(
      `v1/addressBook/recipients/${id}`
    );
    return data.data;
  }

  deleteRecipientById(id: string) {
    return this.circleAPI.delete(`v1/addressBook/recipients/${id}`);
  }

  async createPayout(payload: CreatePayoutPayload) {
    const data = await this.circleAPI.post<CryptoPayout>(
      "/v1/payouts",
      payload
    );
    return data.data;
  }

  async getAllPayOuts(queryParams: PayoutQueryParams) {
    const data = await this.circleAPI.get<CryptoPayout[]>("/v1/payouts", {
      params: queryParams,
    });
    return data.data;
  }
  async getPayoutById(id: string) {
    const data = await this.circleAPI.get<CryptoPayout>(`/v1/payouts/${id}`);
    return data.data;
  }

  async getExchangeRate(tradingPair: "BTC-USD" | "ETH-USD") {
    const data = await this.circleAPI.get(`v1/exchange/rates/${tradingPair}`);
    return data.data;
  }
}
