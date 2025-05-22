const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Payment = require('../models/Payments');

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Importo mancante' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card']
    });

    await Payment.create({
      user: req.user._id,
      amount,
      currency: 'eur',
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Errore Stripe:', err.message);
    res.status(500).json({ message: 'Errore nel pagamento' });
  }
};

module.exports = { createPaymentIntent };
