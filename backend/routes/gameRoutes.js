const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {importGamesFromRawg, getGamesByPlatform, filterAndSearchGames} = require('../apisettings/gameController');

router.get('/', filterAndSearchGames);

router.post('/import/:platform', protect, adminOnly, importGamesFromRawg);
router.get('/:platform', getGamesByPlatform);

module.exports = router;

