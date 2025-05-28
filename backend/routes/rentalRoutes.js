const express = require('express');
const router = express.Router();
const { createRental, getMyRentals, returnRental, getAllRentals, endRentalEarly } = require('../apisettings/rentalController');
const { protect, adminOnly } = require('../middleware/authMiddleware');


// Crea noleggio
router.post('/', protect, createRental);

// Cronologia noleggi dell’utente loggato
router.get('/me', protect, getMyRentals);

// Restituzione del noleggio
router.patch('/:id/return', protect, returnRental);

// Visualizzazione di tutti i noleggi solo se Admin
router.get('/admin/all', protect, adminOnly, getAllRentals);

//Restituzione anticipata del noleggio
router.patch('/:id/end-early', protect, endRentalEarly);


module.exports = router;
