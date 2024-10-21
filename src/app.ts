import * as express from "express";
import * as mcache from "memory-cache";
import { APP_CACHE_DURATION_MS } from "./constants";
import { getAveragePrices } from "./binance-api";

export const app = express();

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (typeof req.query.symbols !== "string") {
    res.status(400);
    res.json({ message: 'Parameter "symbols" is not provided!' });
    return;
  }
  const symbols: string[] = req.query.symbols
    .split(",")
    .map((val) => val.trim())
    .filter((val) => !!val);
  if (symbols.length === 0) {
    res.status(400);
    res.json({ message: "At least one symbol should be provided!" });
    return;
  }

  const cacheKey = symbols.sort().join("");
  const cachedBody = mcache.get(cacheKey);

  if (cachedBody) {
    res.status(200);
    res.json(cachedBody);
    return;
  }

  const result = await getAveragePrices(symbols);
  mcache.put(cacheKey, result, APP_CACHE_DURATION_MS);
  res.status(200);
  res.json(result);
});
