export const BINANCE_API_URL =
  process.env.BINANCE_API_URL ?? "https://testnet.binance.vision";
export const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
export const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;
export const BINANCE_COMMISSION =
  Number(process.env.BINANCE_COMMISSION ?? "0.01") / 100;
