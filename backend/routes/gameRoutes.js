const express = require('express');
const router = express.Router();
const {importGamesFromRawg, getGamesByPlatform, filterAndSearchGames} = require('../apisettings/gameController');

router.get('/', filterAndSearchGames);

router.post('/import/:platform', importGamesFromRawg);
router.get('/:platform', getGamesByPlatform);

module.exports = router;

