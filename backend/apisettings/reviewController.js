const Review = require('../models/Review');
const Game = require('../models/Game');

// Recupera tutte le recensioni per un determinato gioco
const getReviewsByGame = async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId }).populate('user', 'nome');
    res.json(reviews);
  } catch (err) {
    console.error('Errore nel recupero recensioni:', err.message);
    res.status(500).json({ message: 'Errore nel recupero recensioni' });
  }
};

// Crea una nuova recensione
const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const gameId = req.params.gameId;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Valutazione non valida.' });
  }

  try {
    // Salva direttamente la nuova recensione senza controlli di unicità
    const review = new Review({
      game: gameId,
      user: userId,
      rating,
      comment
    });
    await review.save();

    // Aggiorna le statistiche del gioco
    const game = await Game.findById(gameId);
    const reviews = await Review.find({ game: gameId });

    game.ratingCount = reviews.length;
    game.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await game.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('Errore nel salvataggio della recensione:', err.message);
    res.status(500).json({ message: 'Errore nel salvataggio della recensione' });
  }
};

module.exports = {
  getReviewsByGame,
  createReview
};
