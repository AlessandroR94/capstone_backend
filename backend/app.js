const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes (da aggiungere man mano)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use(passport.initialize());
app.use('/api/rentals', require('./routes/rentalRoutes'));


module.exports = app;
