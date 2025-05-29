const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  reviews: [reviewSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
