"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleCryptoPayment = void 0;
class CircleCryptoPayment {
    constructor(circleAPI) {
        this.circleAPI = circleAPI;
    }
    getSupportedCurrenciesAndChains() {
        return {
            USDC: ["ALGO", "AVAX", "ETH", "MATIC", "SOL", "TRX"],
            BTC: ["BTC"],
            ETH: ["ETH"],
        };
    }
    createPaymenIntent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post("/v1/paymentIntents", payload);
            return data.data;
        });
    }
    getAllPaymentIntents(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get("/v1/paymentIntents", {
                params: queryParams,
            });
            return data.data.map((intentData) => intentData);
        });
    }
    getPaymentIntentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`/v1/paymentIntents/${id}`);
            return data.data;
        });
    }
    expirePaymentIntentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post(`v1/paymentIntents/${id}/expire`);
            return data.data;
        });
    }
    refundPaymentById(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post(`/v1/paymentIntents/${id}/refund`, payload);
            return data.data;
        });
    }
    getExchangeRate(tradingPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`v1/exchange/rates/${tradingPair}`);
            return data.data;
        });
    }
    createSubscription(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post(`/v1/notifications/subscriptions`, {
                endpoint: url,
            });
            return data.data;
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`/v1/notifications/subscriptions`);
            return data.data;
        });
    }
    removeSubcsription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.delete(`/v1/notifications/subscriptions/${id}`);
            return data.data;
        });
    }
}
exports.CircleCryptoPayment = CircleCryptoPayment;
