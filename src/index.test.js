const request = require("supertest");
const credits = require('./models/credits')
const app = require("./index.js");

beforeEach(() => {
  credits.truncate();
});

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("/credits/:user", () => {
  test("shows credit balance & transactions", async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'fred',
      amount: 10,
      order_id: null
    });

    const response = await request(app).get("/credits/fred")
    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toEqual(10)
    expect(response.body.transactions.length).toEqual(1)
  });
});

describe("/credits/:user/allocate", () => {
  test("saves an expiry for allocated credit", async () => {
    const body = {
      validForDays: 366,
      amount: 123
    }
    const response = await request(app).post("/credits/fred/allocate").send(body)
    expect(response.statusCode).toBe(201);
    expect(response.body.balance).toEqual(123)

    const rows = credits.findByUser('fred')
    expect(rows[0].amount).toEqual(123)

    // Just check it looks like a ISO timestamp...
    expect(rows[0].expires_at.length).toEqual(24)
  });
});

describe("/credits/:user/spend", () => {
  test("allows credit spend only if balance is sufficient", async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'fred',
      amount: 10,
      order_id: null,
    });

    // $11 spend should be rejected because current balance is $10
    const response1 = await request(app).post("/credits/fred/spend").send({
      amount: 11,
      orderId: 'a1'
    })
    expect(response1.statusCode).toBe(403);
    expect(response1.body.balance).toEqual(10)
    expect(response1.body.error).toEqual('insufficient balance')

    //... but $10 spend should be allowed
    const response2 = await request(app).post("/credits/fred/spend").send({
      amount: 10,
      orderId: 'a1',
    })
    expect(response2.statusCode).toBe(201);
    expect(response2.body.balance).toEqual(0)
  });

  test("blocks spend and expires credit if past expiry", async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2020-01-02T00:00:00.000Z',
      user: 'fred',
      amount: 10
    });

    const response1 = await request(app).post("/credits/fred/spend").send({
      amount: 5,
      orderId: 'a1',
    })
    expect(response1.statusCode).toBe(403);
    expect(response1.body.balance).toEqual(0)
    expect(response1.body.error).toEqual('balance expired')
  });
});
