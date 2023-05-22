import { AxiosInstance } from "axios";
import {
  CardData,
  CardPayment,
  CreateCardPayload,
  CreateCardPaymentPayload,
  RefundPaymentPayload,
} from "./types";
import { CryptoPayment } from "../crypto/interface";

export class CircleCardPayment {
  circleAPI: AxiosInstance;
  constructor(circleAPI: AxiosInstance) {
    this.circleAPI = circleAPI;
  }

  async createCard(payload: CreateCardPayload) {
    const data = await this.circleAPI.post<CardData>("/v1/cards", payload);
    return data.data;
  }

  async getEncryptionKey() {
    const data = await this.circleAPI.get<{ keyId: string; publicKey: string }>(
      "/v1/encryption/public"
    );
    return data.data;
  }

  async getCardById(id: string) {
    const data = await this.circleAPI.get<CardData>(`/v1/cards/${id}`);
    return data.data;
  }

  async createCardPayment(payload: CreateCardPaymentPayload) {
    const data = await this.circleAPI.post<CardPayment>(
      "/v1/payments",
      payload
    );
    return data.data;
  }

  async refundCardPayment(id: string, payload: RefundPaymentPayload) {
    const data = await this.circleAPI.post<CardPayment>(
      `v1/payments/${id}/refund`,
      payload
    );
    return data.data;
  }

  async getPaymentById(id: string) {
    const data = await this.circleAPI.get<CryptoPayment | CardPayment>(
      `v1/payments/${id}`
    );
    return data.data;
  }
}
