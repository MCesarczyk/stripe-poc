import { Request, Response } from 'express';
const stripe = require('stripe')('sk_test_51NydosCxMXw7GjawGOwp7etQENGqmjNRwh0fMmDP9nTdi3ApgfLPTPMeXoNiIFHs969mdy1sPd15rLe4fSKRWlk90091vKlK6K');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

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
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
  });

  console.log(session.client_secret);

  res.send({ clientSecret: session.client_secret });
});

app.get('/session-status', async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));