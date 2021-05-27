const credits = require('./credits');

beforeEach(() => {
  credits.truncate();
});

describe('credits.truncate', () => {
  test('deletes all credits', async () => {
    credits.loadSavedData();
    expect(credits.findAll().length).toBeGreaterThan(0);
    credits.truncate();
    expect(credits.findAll().length).toEqual(0);
  });
});

describe('credits.loadSavedData', () => {
  test('loads saved data', async () => {
    expect(credits.findAll().length).toEqual(0);
    credits.loadSavedData();
    expect(credits.findAll().length).toBeGreaterThan(0);
  });
});

describe('credits.create', () => {
  test('adds a new row', async () => {
    expect(credits.findAll().length).toEqual(0);
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'fred',
      amount: 123,
      order_id: null,
    });
    const allCredits = credits.findAll()
    expect(allCredits.length).toEqual(1);
    expect(allCredits[0].user).toEqual('fred');
  });
});

describe('credits.findAll', () => {
  test('returns an array of credits', async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'sue',
      amount: 123,
      order_id: null,
    });
    const allCredits = credits.findAll()
    expect(allCredits.length).toEqual(1);
    expect(allCredits[0].user).toEqual('sue');
  });
});

describe('credits.findByUser', () => {
  test('returns an array of credits for a specific user', async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'mary',
      amount: 456,
      order_id: null,
    });
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'frank',
      amount: 123,
      order_id: null,
    });
    const allCredits = credits.findByUser('mary')
    expect(allCredits.length).toEqual(1);
    expect(allCredits[0].user).toEqual('mary');
  });
});

describe('credits.balance', () => {
  test('returns the current credits balance for a user', async () => {
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: '2999-01-02T00:00:00.000Z',
      user: 'frank',
      amount: 10,
      order_id: null,
    });
    credits.create({
      created_at: '2018-01-01T00:00:00.000Z',
      expires_at: null,
      user: 'frank',
      amount: -4,
      order_id: 'a1',
    });
    const balance = credits.balance('frank')
    expect(balance).toEqual(6);
  });
});