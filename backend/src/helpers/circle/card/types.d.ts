interface AmountInfo {
  amount: string;
  currency: "USD";
}

interface BillingDetails {
  name: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  district: string;
  postalCode: string;
}

type Metadata = {
  email: string;
  phoneNumber: string;
  ipAddress: string;
  sessionId: string;
};

export interface UpdateCardPayload {
  keyId: string;
  encryptedData: string;
  expMonth: number;
  expYear: number;
}

export interface CreateCardPayload {
  idempotencyKey: string;
  keyId: string;
  encryptedData: string;
  billingDetails: BillingDetails;
  expMonth: number;
  expYear: number;
  metadata: MetaData;
}

interface CardData {
  id: string;
  status: "confirmed" | "pending" | "failed";
  billingDetails: BillingDetails;
  expMonth: number;
  expYear: number;
  metadata: MetaData;
  last4: string;
  bin: string;
  network: "VISA" | "MASTERCARD" | "AMEX" | "UNKNOWN";
  issuerCountry: string;
  fundingType: "credit" | "debit" | "prepaid" | "unknwown";
  riskEvaluation: RiskEvaluation;
  createDate: string;
  updateDate: string;
  verification: {
    avs: string;
    card: string;
  };
}

export interface BasePaymentPayload {
  idempotencyKey: string;
  amount: {
    amount: string;
    currency: string;
  };
  source: {
    id: string;
    type: string;
  };
  description: string;
  channel?: string;
  metadata: MetaData;
}

export interface CreateCardPaymentPayload extends BasePaymentPayload {
  verification: "cvv";
  autoCapture?: boolean;
  verificationSuccessUrl?: string;
  verificationFailureUrl?: string;
  keyId: string;
  encryptedData: string;
}

export interface RefundPaymentPayload {
  idempotencyKey: string;
  amount: {
    amount: string;
    currency: string;
  };
  reason: string | undefined;
}

export interface CardPayment {
  id: string;
  type: "payment" | "refund";
  description: string;
  merchantId: string;
  merchantWalletId: string;
  amount: AmountInfo;
  source: {
    id: string;
    type: "card";
  };
  description: string;
  status: "confirmed" | "pending" | "failed" | "paid" | "action_required";
  verification: {
    avs: string;
    card: string;
  };
  createDate: string;
  updateDate: string;
  riskEvaluation: RiskEvaluation;
  metadata: Metadata;
  errorCode: string;
  fees: AmountInfo;
  channel: string;
  cancel?: any;
  refunds: any[];
  trackingRef: string;
  originalPayment?: any;
}
