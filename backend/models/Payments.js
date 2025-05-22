const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'eur'
  },
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  status: {
  type: String,
  enum: [
    'requires_payment_method',
    'requires_confirmation',
    'requires_action',
    'processing',
    'succeeded',
    'canceled',
    'failed'
  ],
  default: 'processing'
}

}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
