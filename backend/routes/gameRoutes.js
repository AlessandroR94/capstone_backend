const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {importGamesFromRawg, getGamesByPlatform, filterAndSearchGames, getGameById } = require('../apisettings/gameController');
const { addGameReview } = require('../apisettings/gameController');

router.get('/', filterAndSearchGames);



router.post('/import/:platform', protect, adminOnly, importGamesFromRawg);
router.get('/:platform', getGamesByPlatform);
router.get('/details/:id', getGameById);
router.post('/:id/reviews', protect, addGameReview);

module.exports = router;

