import { Request, Response } from 'express';
require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_KEY);
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('public'));
app.use(cors())
app.use(express.json());

interface Item {
  id: string;
  amount: number;
}

interface TaxCalculation {
  id: string;
  tax_amount_exclusive: number;
}

const buildLineItem = (item: Item) => {
  return {
    amount: item.amount, // Amount in cents
    reference: item.id,
  };
};

const calculateTax = async (items: Item[], currency: string) => {
  const taxCalculation = await stripe.tax.calculations.create({
    currency,
    customer_details: {
      address: {
        line1: "920 5th Ave",
        city: "Seattle",
        state: "WA",
        postal_code: "98104",
        country: "US",
      },
      address_source: "shipping",
    },
    line_items: items.map((item) => buildLineItem(item)),
  });

  return taxCalculation;
};

const calculateOrderAmount = (items: Item[], taxCalculation: TaxCalculation) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total with any exclusive taxes on the server to prevent
  // people from directly manipulating the amount on the client
  let orderAmount = 1400;
  orderAmount += taxCalculation.tax_amount_exclusive;
  return orderAmount;
};

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello Stripe!');
});

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  const body = req.body;

  if (!body?.items) {
    res.status(400).send({
      error: {
        message: 'Missing items',
      }
    });
    return;
  };

  const items = body.items;

  const taxCalculation = await calculateTax(items, 'pln');
  const amount = calculateOrderAmount(items, taxCalculation);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "pln",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      tax_calculation: taxCalculation.id
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post('/create-checkout-session', async (_req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: 'price_1OQRrSCxMXw7Gjawkzdpt8MV',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    return_url: `${process.env.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
  });

  res.send({ clientSecret: session.client_secret });
});

app.get('/session-status', async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

// const handlePaymentIntentSucceeded = async (paymentIntent) => {
//   // Create a Tax Transaction for the successful payment
//   stripe.tax.transactions.createFromCalculation({
//     calculation: paymentIntent.metadata['tax_calculation'],
//     reference: 'myOrder_123', // Replace with a unique reference from your checkout/order system
//   });
// };

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT} 🥳`));