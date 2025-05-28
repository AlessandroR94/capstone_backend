const User = require('../models/User');
const sendEmail = require('../utility/sendEmail');
const Rental = require('../models/Rental');
const Game = require('../models/Game');



const createRental = async (req, res) => {
  const { gameId, days, shipping } = req.body;

  try {
    const game = await Game.findById(gameId);

    if (!game || game.quantityAvailable <= 0) {
      return res.status(400).json({ message: 'Gioco non disponibile' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const totalPrice = game.dailyPrice * days;

    const rental = await Rental.create({
      user: req.user._id,
      game: gameId,
      days,
      endDate,
      totalPrice,
      shippingInfo: shipping,
      status: 'attivo'
    });

    game.quantityAvailable -= 1;
    await game.save();

    // Recupera utente per email
    const user = await User.findById(req.user._id);

    // INVIO EMAIL CONFERMA NOLEGGIO
    await sendEmail({
      to: user.email,
      subject: `Conferma noleggio – ${game.title}`,
      html: `
    <h2>Ciao ${user.nome},</h2>
    <p>Hai noleggiato <strong>${game.title}</strong> per <strong>${days} giorni</strong>.</p>
    <p>Totale pagato: <strong>€${totalPrice.toFixed(2)}</strong></p>
    <p>Lo riceverai all'indirizzo indicato: <br><em>${shipping.indirizzo}, ${shipping.città}, ${shipping.provincia}</em></p>
    <hr />
    <p>Grazie per aver scelto GameBusters! 🎮</p>
  `
    });


    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel noleggio', error: err.message });
  }
};

const getMyRentals = async (req, res) => {
  console.log('🔍 Utente autenticato:', req.user);

  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('game')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei noleggi' });
  }
};



const returnRental = async (req, res) => {
  const { id } = req.params;

  try {
    const rental = await Rental.findById(id);

    if (!rental) {
      return res.status(404).json({ message: 'Noleggio non trovato' });
    }

    if (rental.status !== 'attivo') {
      return res.status(400).json({ message: 'Questo noleggio non è attivo' });
    }

    rental.status = 'restituito';
    await rental.save();

    // Ripristina disponibilità del gioco
    const game = await Game.findById(rental.game);
    game.quantityAvailable += 1;
    await game.save();

    res.json({ message: 'Gioco restituito con successo', rental });
  } catch (err) {
    res.status(500).json({ message: 'Errore nella restituzione', error: err.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accesso negato' });
    }

    const rentals = await Rental.find().populate('user').populate('game');
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei noleggi' });
  }
};

const renewExpiredRentals = async () => {
  const now = new Date();

  const expiredRentals = await Rental.find({
    status: 'attivo',
    endDate: { $lt: now }
  });

  for (const rental of expiredRentals) {
    const originalDays = rental.days;
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + originalDays);

    // Crea un nuovo noleggio rinnovato
    await Rental.create({
      user: rental.user,
      game: rental.game,
      days: originalDays,
      endDate: newEndDate,
      totalPrice: rental.totalPrice,
      status: 'attivo'
    });

    // Marca quello vecchio come scaduto
    rental.status = 'scaduto';
    await rental.save();

    //Email per ogni noleggio rinnovato
    const user = await User.findById(rental.user);
    const game = await Game.findById(rental.game);

    await sendEmail({
      to: user.email,
      subject: 'Noleggio rinnovato automaticamente',
      html: `
        <p>Ciao ${user.nome},</p>
        <p>Il tuo noleggio per <strong>${game.title}</strong> è stato rinnovato automaticamente per altri ${originalDays} giorni.</p>
        <p>Prezzo: €${rental.totalPrice.toFixed(2)}</p>
        <p>Grazie per aver scelto Gamebusters!</p>
      `
    });
  }

  console.log(`Rinnovati ${expiredRentals.length} noleggi automaticamente`);
};

const endRentalEarly = async (req, res) => {
  const { id } = req.params;

  try {
    const rental = await Rental.findById(id).populate('game');
    if (!rental) return res.status(404).json({ message: 'Noleggio non trovato' });
    if (rental.status !== 'attivo') return res.status(400).json({ message: 'Noleggio già terminato' });

    const now = new Date();
    const daysUsed = Math.max(1, Math.ceil((now - rental.startDate) / (1000 * 60 * 60 * 24)));
    const prezzoUtilizzato = daysUsed * rental.game.dailyPrice;
    const rimborso = Math.max(0, rental.totalPrice - prezzoUtilizzato);

    rental.status = 'terminato';
    rental.actualEndDate = now;
    await rental.save();

    rental.game.quantityAvailable += 1;
    await rental.game.save();

    const user = await User.findById(rental.user);

    await sendEmail({
      to: user.email,
      subject: `Noleggio terminato anticipatamente`,
      html: `
    <h2>Ciao ${user.nome},</h2>
    <p>Hai terminato anticipatamente il noleggio di <strong>${rental.game.title}</strong>.</p>
    <p>Hai usato il gioco per <strong>${daysUsed} giorno/i</strong>, fino al <strong>${now.toLocaleDateString()}</strong>.</p>
    <p>Rimborso calcolato: <strong>€${rimborso.toFixed(2)}</strong></p>
    <p>Riceverai l'importo entro 5-7 giorni lavorativi sul metodo di pagamento utilizzato.</p>
    <hr />
    <p>Grazie per aver scelto GameBusters! 🎮</p>
  `
    });

    res.json({ message: 'Noleggio terminato anticipatamente', rimborso });
  } catch (err) {
    res.status(500).json({ message: 'Errore nel terminare il noleggio', error: err.message });
  }
};




module.exports = {
  createRental,
  getMyRentals,
  returnRental,
  getAllRentals,
  renewExpiredRentals,
  endRentalEarly,
};
