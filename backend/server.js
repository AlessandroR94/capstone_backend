require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const cron = require('node-cron');
const { renewExpiredRentals } = require('./apisettings/rentalController');


dotenv.config();
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Esegui ogni giorno alle 03:00 di notte
cron.schedule('0 3 * * *', async () => {
  console.log('Check e rinnovo dei noleggi scaduti e non terminati');
  await renewExpiredRentals();
});


