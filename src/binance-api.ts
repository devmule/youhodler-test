import { Spot } from "@binance/connector-typescript";
import {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  BINANCE_API_URL,
  BINANCE_COMMISSION,
} from "./constants";

interface Ticker {
  symbol: string;
  price: number;
}

const client = new Spot(BINANCE_API_KEY, BINANCE_API_SECRET, {
  baseURL: BINANCE_API_URL,
});
/**
 * @param symbols string values of concatenated symbols to buy and to sell.
 * @returns average price for each provided symbol according to their bid and ask quantity.
 * */
export async function getAveragePrices(symbols: string[]): Promise<Ticker[]> {
  const result: Ticker[] = [];

  if (symbols.length === 0) return result;
  const tickers = (await client.symbolOrderBookTicker({ symbols })) as {
    symbol: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
  }[];

  for (const ticker of tickers) {
    const bidPrice = Number(ticker.bidPrice) * (1 - BINANCE_COMMISSION);
    const bidQty = Number(ticker.bidQty);
    const askPrice = Number(ticker.askPrice) * (1 + BINANCE_COMMISSION);
    const askQty = Number(ticker.askQty);
    const avgPrice =
      (bidPrice * bidQty + askPrice * askQty) / (bidQty + askQty);
    result.push({
      symbol: ticker.symbol,
      price: avgPrice,
    });
  }

  return result;
}
