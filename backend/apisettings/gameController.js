const Game = require('../models/Game');
const axios = require('axios');

const RAWG_API_KEY = process.env.RAWG_API_KEY;

const importGamesFromRawg = async (req, res) => {
  const { platform } = req.params;

  const platformMap = {
    xbox: [186, 14],
    playstation: [18, 187],
    nintendo: [7]
  };

  const platformIds = platformMap[platform.toLowerCase()];
  if (!platformIds) {
    return res.status(400).json({ message: 'Piattaforma non valida' });
  }

  const formattedPlatform =
    platform.toLowerCase() === 'xbox' ? 'Xbox' :
      platform.toLowerCase() === 'playstation' ? 'PlayStation' :
        platform.toLowerCase() === 'nintendo' ? 'Nintendo' :
          null;

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
        const randomPrice = (Math.random() * (5.99 - 2.99) + 2.99).toFixed(2);
        const randomQuantity = Math.floor(Math.random() * 11); // 0–10

        const game = await Game.create({
          title: g.name,
          platform: formattedPlatform,
          description: g.slug,
          imageUrl: g.background_image,
          dailyPrice: parseFloat(randomPrice),
          quantityAvailable: randomQuantity,
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

  const validPlatforms = ['Xbox', 'PlayStation', 'Nintendo'];
  const formattedPlatform =
    platform.toLowerCase() === 'xbox'
      ? 'Xbox'
      : platform.toLowerCase() === 'playstation'
        ? 'PlayStation'
        : 'Nintendo';

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

  if (platform) {
    const formattedPlatform =
      platform.toLowerCase() === 'xbox'
        ? 'Xbox'
        : platform.toLowerCase() === 'playstation'
          ? 'PlayStation'
          : 'Nintendo';
    query.platform = formattedPlatform;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (available === 'true') {
    query.quantityAvailable = { $gt: 0 };
  }

  let sortOption = {};
  if (sort === 'price') sortOption.dailyPrice = 1;
  else if (sort === 'price_desc') sortOption.dailyPrice = -1;
  else if (sort === 'name') sortOption.title = 1;
  else if (sort === 'name_desc') sortOption.title = -1;

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

const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Gioco non trovato' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Errore' });
  }
};

module.exports = {
  importGamesFromRawg,
  getGamesByPlatform,
  filterAndSearchGames,
  getGameById
};
