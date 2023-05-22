"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleAPI = exports.ANONYMOUS_PASS = exports.ANONYMOUS_EMAIL = exports.LOGIN_SECRET = exports.APP_EMAIL_PASS = exports.APP_EMAIL = exports.ACTIVATION_SECRET = exports.REDIS_PORT = exports.REDIS_USERNAME = exports.REDIS_HOST = exports.REDIS_PASSWORD = exports.PORT = exports.MODE = exports.uri = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.uri = String(process.env.MONGO_CONNECTION_STRING);
exports.MODE = String(process.env.MODE);
exports.PORT = parseInt(process.env.PORT) || 8000;
exports.REDIS_PASSWORD = String(process.env.REDIS_PASSWORD);
exports.REDIS_HOST = String(process.env.REDIS_HOST);
exports.REDIS_USERNAME = String(process.env.REDIS_USERNAME);
exports.REDIS_PORT = Number(process.env.REDIS_PORT);
exports.ACTIVATION_SECRET = String(process.env.ACTIVATION_SECRET);
exports.APP_EMAIL = String(process.env.APP_EMAIL);
exports.APP_EMAIL_PASS = String(process.env.APP_EMAIL_PASS);
exports.LOGIN_SECRET = String(process.env.LOGIN_SECRET);
exports.ANONYMOUS_EMAIL = String(process.env.ANONYMOUS_EMAIL);
exports.ANONYMOUS_PASS = String(process.env.ANONYMOUS_PASS);
const CIRCLE_API_KEY = String(process.env.CIRCLE_API_KEY);
exports.CircleAPI = axios_1.default.create({
    baseURL: "https://api-sandbox.circle.com/",
    headers: { Authorization: `Bearer ${CIRCLE_API_KEY}` },
});
exports.CircleAPI.interceptors.response.use(function (response) {
    if (response.data) {
        return response.data;
    }
    return response;
}, function (error) {
    let response = error.response;
    if (!response) {
        response = error.toJSON();
    }
    return Promise.reject(response);
});
