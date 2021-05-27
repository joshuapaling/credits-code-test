# Credits Service

This API manages store credits for our users. Users can be allocated credit (with an expiry date), and they can spend their unexpired credit.

## Getting started

```bash
# run the web server
yarn start

# run in dev mode, restarts the server on every file save
# (note: every restart will clear the dummy in-memory database)
yarn dev

# runs the tests
yarn test
```

## Data

For this 'toy' service, rather than have a full database, we have a simple in-memory 'database' that just holds an array of credit transactions. Search `inMemoryDB` to see how it's used.

When the server starts, we import some data from `src/data/credits.json`, into the in-memory 'database'. We know that any changes made to the data will be lost when the server shuts down, and that's fine. No need to address that in this test.

## Endpoints

Allocate credits to user "fred":

```bash
$ curl -d '{"amount": 100, "validForDays": 365}' -H "Content-Type: application/json" http://localhost:3000/credits/fred/allocate
```

Spend credits for user "fred":

```bash
$ curl -d '{"amount": 100, "orderId": "a1"}' -H "Content-Type: application/json" http://localhost:3000/credits/fred/spend
```

Get credits balance and transaction history for user "fred":

```bash
$ curl http://localhost:3000/credits/fred
```
