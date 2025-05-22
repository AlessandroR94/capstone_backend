const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent } = require('../apisettings/paymentController');

router.post('/checkout', protect, createPaymentIntent);

module.exports = router;
