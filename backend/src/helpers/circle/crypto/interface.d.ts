export type SupportedChains =
  | "ALGO"
  | "AVAX"
  | "BTC"
  | "ETH"
  | "MATIC"
  | "SOL"
  | "TRX";

type SupportedCurrencies = "USD" | "ETH" | "BTC";

interface PaymentMethod {
  type: "blockchain";
  chain: SupportedChains;
}

interface AmountInfo {
  amount: string;
  currency: SupportedCurrencies;
}

export interface RiskEvaluation {
  decision: "approved" | "denied" | "review";
  reason: string;
}

export interface CreatePaymentIntentPayload {
  idempotencyKey: string;
  amount: AmountInfo;
  settlementCurrency: string;
  paymentMethods: PaymentMethod[];
  merchantWalletId?: string;
}

export interface RefundPaymentIntentPayLoad {
  idempotencyKey: string;
  destination: {
    address: string;
    chain: SupportedChains;
  };
  amount: {
    currency: SupportedCurrencies;
  };
  toAmount: AmountInfo;
}

export interface CryptoPayment {
  id: string;
  type: "payment" | "refund";
  merchantId: string;
  source: { type: "chain" };
  merchantWalletId?: string;
  amount: AmountInfo;
  status: "confirmed" | "pending" | "failed" | "paid" | "action_required";
  paymentIntentId: string;
  settlementAmount: AmountInfo;
  fees: AmountInfo;
  fromAddresses: {
    address: string;
    chain: SupportedChains;
  };
  depositAddress: {
    address: string;
    chain: SupportedChains;
  };
  transactionHash: string;
  createDate: string;
  updateDate: string;
  riskEvaluation: RiskEvaluation;
}

export interface CryptoRefundPayment extends Omit<CryptoPayment, "type"> {
  type: "refund";
}

export interface PaymentIntentsQueryParams {
  status?: "created" | "pending" | "expired" | "complete" | "failed";
  context?: "paid" | "overpaid" | "underpaid";
  from?: string;
  to?: string;
  pageAfter?: string;
  pageSize?: number;
}

export interface PaymentIntent {
  id: string;
  amount: AmountInfo;
  amountPaid: AmountInfo;
  amountRefunded: AmountInfo;
  settlementCurrency: string;
  paymentMethods: PaymentMethod[];
  paymentIds: string[];
  refundIds: string[];
  settlementCurrency: SupportedCurrencies;
  fees: { type: string; amount: string; currency: string }[];
  timeline: {
    status: "created" | "pending" | "expired" | "complete" | "failed";
    context: "paid" | "overpaid" | "underpaid";
    reason: string;
    time: string;
  };
  expiresOn: string;
  createDate: string;
  updateDate: string;
  merchantWalletId: string;
}

export interface PayoutRecipient {
  id: string;
  chain: SupportedChains;
  address: string;
  addressTag: string;
  status: string;
  createDate: string;
  updateDate: string;
  metadata: {
    nickname: string;
    email: string;
  };
}

export interface CreateRecipientPayload
  extends Omit<PayoutRecipient, "id" | "createDate" | "updateDate" | "status"> {
  idempotencyKey: string;
}

export interface RecipientsQueryParams {
  address?: string;
  chain?: string;
  email?: string;
  from?: string;
  to?: string;
  status?: "active" | "inactive" | "pending" | "denied";
  pageAfter?: string;
  pageSize?: number;
}

export interface CreatePayoutPayload {
  idempotencyKey: string;
  source: {
    type: "wallet";
    id: string;
  };
  destination: {
    type: "address_book";
    id: string;
  };
  amount: AmountInfo;
  toAmount: {
    currency: SupportedCurrencies;
  };
}

export interface CryptoPayout {
  id: string;
  sourceWalletId: string;
  destination: {
    type: "address_book";
    id: string;
  };
  amount: AmountInfo;
  toAmount: AmountInfo;
  fees: AmountInfo;
  networkFees: AmountInfo;
  status: "pending" | "complete" | "failed";
  errorCode: string;
  createDate: string;
  updateDate: string;
  riskEvaluation: RiskEvaluation;
}

export interface PayoutQueryParams {
  source?: string;
  destination?: string;
  type?: string[];
  status?: string[];
  sourceCurrency?: SupportedCurrencies;
  destinationCurrency?: SupportedCurrencies;
  chain?: SupportedChains;
  from?: string;
  to?: string;
  pageAfter?: string;
  pageSize?: number;
}

export interface SubscriptionData {
  id: string;
  endpoint: string;
  subscriptionDetails: {
    url: string;
    status: "confirmed" | "pending" | "deleted";
  };
}
