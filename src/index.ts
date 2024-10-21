import * as express from "express";
import * as mcache from "memory-cache";
import { APP_CACHE_DURATION_MS, APP_PORT } from "./constants";
import { BinanceApi } from "./binance-api";

const app = express();

app.get("/", (req, res) => {
  let symbols: string[] = req.query.symbols;
  try {
    if (typeof req.query.symbols !== "string") {
      throw new Error('Parameter "symbols" is not provided!');
    }
    symbols = req.query.symbols.split(",");
    if (symbols.length === 0) {
      throw new Error("At least one symbol should be provided!");
    }
  } catch (e: Error) {
    res.status(400);
    res.json({ message: e.message });
    return;
  }

  const cacheKey = symbols.sort().join();
  const cachedBody = mcache.get(cacheKey);

  if (cachedBody) {
    res.status(200);
    res.json(cachedBody);
    return;
  }

  const binanceApi = new BinanceApi();
  binanceApi
    .getAveragePrices(symbols)
    .catch(() => {
      res.status(500);
      res.json({ message: "Internal error" });
      return;
    })
    .then((result) => {
      mcache.put(cacheKey, result, APP_CACHE_DURATION_MS);
      res.status(200);
      res.json(result);
    });
});

app.listen(APP_PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${APP_PORT}`);
});
