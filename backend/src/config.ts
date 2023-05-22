import axios from "axios";
import { config } from "dotenv";
config();

export const uri = String(process.env.MONGO_CONNECTION_STRING);
export const MODE = String(process.env.MODE);
export const PORT: number = parseInt(process.env.PORT as string) || 8000;
export const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD);
export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_USERNAME = String(process.env.REDIS_USERNAME);
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const ACTIVATION_SECRET = String(process.env.ACTIVATION_SECRET);
export const APP_EMAIL = String(process.env.APP_EMAIL);
export const APP_EMAIL_PASS = String(process.env.APP_EMAIL_PASS);
export const LOGIN_SECRET = String(process.env.LOGIN_SECRET);
export const ANONYMOUS_EMAIL = String(process.env.ANONYMOUS_EMAIL);
export const ANONYMOUS_PASS = String(process.env.ANONYMOUS_PASS);
const CIRCLE_API_KEY = String(process.env.CIRCLE_API_KEY);

export const CircleAPI = axios.create({
  baseURL: "https://api-sandbox.circle.com/",
  headers: { Authorization: `Bearer ${CIRCLE_API_KEY}` },
});

CircleAPI.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    let response = error.response;
    if (!response) {
      response = error.toJSON();
    }
    return Promise.reject(response);
  }
);
