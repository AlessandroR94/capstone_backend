const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: {
    type: String,
    enum: ['Xbox', 'PlayStation', 'Nintendo'],
    required: true
  },
  description: String,
  imageUrl: String,
  dailyPrice: { type: Number, required: true },
  quantityAvailable: { type: Number, default: 1 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
