import { Request, Response } from 'express';
require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_KEY);
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.static('public'));

app.use(cors())

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello Stripe!');
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

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT} 🥳`));