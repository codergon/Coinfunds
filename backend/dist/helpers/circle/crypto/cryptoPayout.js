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
exports.CircleCryptoPayout = void 0;
class CircleCryptoPayout {
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
    getSupportedSourceToDestinfation() {
        return {
            BTC: ["USDC"],
            USDC: ["BTC", "ETH"],
            ETH: ["USDC"],
        };
    }
    getMasterWalletId() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get("v1/configuration");
            return data.data.payments.masterWalletId;
        });
    }
    createRecipient(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post("/v1/addressBook/recipients", payload);
            return data.data;
        });
    }
    getAllRecipients(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get("v1/addressBook/recipients", {
                params: queryParams,
            });
            return data.data;
        });
    }
    getRecipientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`v1/addressBook/recipients/${id}`);
            return data.data;
        });
    }
    deleteRecipientById(id) {
        return this.circleAPI.delete(`v1/addressBook/recipients/${id}`);
    }
    createPayout(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post("/v1/payouts", payload);
            return data.data;
        });
    }
    getAllPayOuts(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get("/v1/payouts", {
                params: queryParams,
            });
            return data.data;
        });
    }
    getPayoutById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`/v1/payouts/${id}`);
            return data.data;
        });
    }
    getExchangeRate(tradingPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`v1/exchange/rates/${tradingPair}`);
            return data.data;
        });
    }
}
exports.CircleCryptoPayout = CircleCryptoPayout;
