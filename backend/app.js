require('./config/passport');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/userRoutes');


const app = express();

// Middleware
app.use('/api/stripe', require('./routes/stripeWebhook'));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use(passport.initialize());
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);




module.exports = app;
