const Game = require('../models/Game');
const axios = require('axios');

const RAWG_API_KEY = process.env.RAWG_API_KEY;

const importGamesFromRawg = async (req, res) => {
  const { platform } = req.params;

  // Mappa piattaforme: RAWG ID associati a Xbox e PlayStation
  const platformMap = {
    xbox: [186, 14],
    playstation: [18, 187]
  };

  const platformIds = platformMap[platform.toLowerCase()];
  if (!platformIds) {
    return res.status(400).json({ message: 'Piattaforma non valida' });
  }

  // Correzione capitale piattaforma
  const formattedPlatform = platform.toLowerCase() === 'xbox' ? 'Xbox' : 'PlayStation';

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        platforms: platformIds.join(','),
        page_size: 40
      }
    });

    const rawGames = response.data.results;
    const savedGames = [];

    for (const g of rawGames) {
      const exists = await Game.findOne({ title: g.name, platform: formattedPlatform });

      if (!exists) {
        const game = await Game.create({
          title: g.name,
          platform: formattedPlatform,
          description: g.slug,
          imageUrl: g.background_image,
          dailyPrice: 3.99,
          quantityAvailable: 5
        });

        savedGames.push(game);
      }
    }

    res.status(201).json({ message: `Importati ${savedGames.length} giochi` });
  } catch (err) {
    console.error('Errore durante importazione:', err.message);
    res.status(500).json({ message: 'Errore durante l\'importazione', error: err.message });
  }
};

const getGamesByPlatform = async (req, res) => {
  const { platform } = req.params;

  const validPlatforms = ['Xbox', 'PlayStation'];
  const formattedPlatform = platform.toLowerCase() === 'xbox' ? 'Xbox' : 'PlayStation';

  if (!validPlatforms.includes(formattedPlatform)) {
    return res.status(400).json({ message: 'Piattaforma non valida' });
  }

  try {
    const games = await Game.find({ platform: formattedPlatform });
    res.json(games);
  } catch (err) {
    console.error('Errore durante recupero giochi:', err.message);
    res.status(500).json({ message: 'Errore durante il recupero dei giochi' });
  }
};

const filterAndSearchGames = async (req, res) => {
  const { platform, search, sort, page = 1, available } = req.query;

  const query = {};

  // Filtro per piattaforma
  if (platform) {
    const formattedPlatform = platform.toLowerCase() === 'xbox' ? 'Xbox' : 'PlayStation';
    query.platform = formattedPlatform;
  }

  // Ricerca per titolo
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filtro per disponibilità
  if (available === 'true') {
    query.quantityAvailable = { $gt: 0 };
  }

  // Ordinamento
  let sortOption = {};
  if (sort === 'price') sortOption.dailyPrice = 1;
  else if (sort === 'price_desc') sortOption.dailyPrice = -1;
  else if (sort === 'name') sortOption.title = 1;
  else if (sort === 'name_desc') sortOption.title = -1;

  // Paginazione
  const pageSize = 20;
  const skip = (Number(page) - 1) * pageSize;

  try {
    const games = await Game.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const total = await Game.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / pageSize),
      results: games
    });
  } catch (err) {
    console.error('Errore nel filtro giochi:', err.message);
    res.status(500).json({ message: 'Errore durante il recupero dei giochi filtrati' });
  }
};



module.exports = {
  importGamesFromRawg,
  getGamesByPlatform,
  filterAndSearchGames
};
