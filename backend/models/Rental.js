const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  startDate: { type: Date, required: true, default: Date.now },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  actualEndDate: { type: Date },
  status: { type: String, enum: ['attivo', 'restituito', 'scaduto', 'terminato'], default: 'attivo' },
  shippingInfo: {
    nome: String,
    cognome: String,
    indirizzo: String,
    città: String,
    provincia: String,
    telefono: String
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Rental', rentalSchema);
