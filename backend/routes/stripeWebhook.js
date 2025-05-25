const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payments');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook ricevuto da Stripe:', event.type);

  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log('🔍 Cerco pagamento con ID:', paymentIntent.id);

    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });

      if (payment) {
        payment.status = paymentIntent.status;
        await payment.save();
        console.log(`Pagamento aggiornato: ${paymentIntent.id} → ${paymentIntent.status}`);
      } else {
        console.log('Nessun pagamento trovato per questo PaymentIntent ID!');
      }
    } catch (err) {
      console.error('Errore aggiornamento pagamento:', err.message);
    }
  }

  res.json({ received: true });
});

module.exports = router;
