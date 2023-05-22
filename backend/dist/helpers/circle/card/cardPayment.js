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
exports.CircleCardPayment = void 0;
class CircleCardPayment {
    constructor(circleAPI) {
        this.circleAPI = circleAPI;
    }
    createCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post("/v1/cards", payload);
            return data.data;
        });
    }
    getEncryptionKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get("/v1/encryption/public");
            return data.data;
        });
    }
    getCardById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`/v1/cards/${id}`);
            return data.data;
        });
    }
    createCardPayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post("/v1/payments", payload);
            return data.data;
        });
    }
    refundCardPayment(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.post(`v1/payments/${id}/refund`, payload);
            return data.data;
        });
    }
    getPaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.circleAPI.get(`v1/payments/${id}`);
            return data.data;
        });
    }
}
exports.CircleCardPayment = CircleCardPayment;
