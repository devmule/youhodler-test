jest.mock("./binance-api", () => ({
  getAveragePrices: jest.fn(async (symbols: string[]) => {
    return [];
  }),
}));

import * as request from "supertest";
import * as mcache from "memory-cache";
import { app } from "./app";
import { getAveragePrices } from "./binance-api";

describe("application", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mcache.clear();
  });

  it("should return error if symbols parameter is not passed", async () => {
    await request(app)
      .get("/")
      .expect("Content-Type", /application\/json/)
      .expect(400);
  });

  it("should return error if symbols parameter is empty", async () => {
    await request(app)
      .get("/?symbols")
      .expect("Content-Type", /application\/json/)
      .expect(400);
  });

  it("should return json format", async () => {
    await request(app)
      .get("/?symbols=A,B,C")
      .expect("Content-Type", /application\/json/)
      .expect(200);
  });

  it("should fetch from binance api", async () => {
    await request(app).get("/?symbols=HELLO");
    await request(app).get("/?symbols=WORLD");
    expect(getAveragePrices).toBeCalledTimes(2);
  });

  it("should cache results", async () => {
    await request(app).get("/?symbols=HELLO,WORLD");
    await request(app).get("/?symbols=HELLO,WORLD");
    await request(app).get("/?symbols=WORLD,HELLO"); // even different order
    expect(getAveragePrices).toBeCalledTimes(1);
  });
});
