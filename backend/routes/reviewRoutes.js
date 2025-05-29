const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getReviewsByGame, createReview } = require('../apisettings/reviewController');

router.get('/:gameId', getReviewsByGame);
router.post('/:gameId', protect, createReview);

module.exports = router;
