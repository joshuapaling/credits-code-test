const request = require("supertest");
const date = require("./date.js");

describe("date.addDays", () => {
  test("works within same month", async () => {
    const start = new Date('2020-01-12T23:05:00.000Z')
    const result = date.addDays(start, 5)
    expect(result.toISOString()).toEqual('2020-01-17T23:05:00.000Z')
  });

  test("can span into the next month", async () => {
    const start = new Date('2020-01-12T23:05:00.000Z')
    const result = date.addDays(start, 30)
    expect(result.toISOString()).toEqual('2020-02-11T23:05:00.000Z')
  });

  test("can span into the next year", async () => {
    const start = new Date('2020-01-12T23:05:00.000Z')
    const result = date.addDays(start, 366) // Note 2020 is a leap year
    expect(result.toISOString()).toEqual('2021-01-12T23:05:00.000Z')
  });
});