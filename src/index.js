const express = require('express')
const bodyParser = require('body-parser')
const credits = require('./models/credits')
const date = require('./lib/date')
const app = express()
const port = 3000

app.use(bodyParser.json({ limit: '1mb' }))

// Initiate our fake in-memory database
credits.loadSavedData()

app.get('/', (req, res) => {
  res.send('Hello Candidates!')
})

app.get('/credits/:user', (req, res) => {
  const { user } = req.params
  res.status(200).json({
    balance: credits.balance(user),
    transactions: credits.findByUser(user),
  })
})

app.post('/credits/:user/allocate', (req, res) => {
  const { amount, validForDays } = req.body
  const { user } = req.params
  const now = new Date()
  const expiry = date.addDays(now, validForDays)

  credits.create({
    created_at: now.toISOString(),
    expires_at: expiry.toISOString(),
    user: user,
    amount: amount,
    order_id: null
  })

  res.status(201).json({
    balance: credits.balance(user)
  })
})

app.post('/credits/:user/spend', (req, res) => {
  const { amount, orderId } = req.body
  const { user } = req.params

  // we're spending credit, so check we have enough
  const balance = credits.balance(user)
  if (balance < amount) {
    return res.status(403).send({
      error: 'insufficient balance',
      balance
    })
  }

  const transactions = credits.findByUser(user)
  const expiryTimestamps = transactions.filter(t => t.expires_at)
                               .map(t => new Date(t.expires_at).getTime())

  const maxExpiry = Math.max(expiryTimestamps)
  const now = new Date()
  if (maxExpiry < now.getTime()) {
    // expire the credit by spending the unused balance on nothing
    credits.create({
      created_at: now.toISOString(),
      expires_at: null,
      user: user,
      amount: balance * -1,
      order_id: null,
    })
    return res.status(403).send({
      error: 'balance expired',
      balance: credits.balance(user),
    })
  }

  credits.create({
    created_at: now.toISOString(),
    expires_at: null,
    user: user,
    amount: amount * -1,
    order_id: orderId,
  })
  res.status(201).json({
    balance: credits.balance(user)
  })
})

module.exports = app;
