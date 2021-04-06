const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// auth
router.use('/auth', require('./auth'));
router.use('/callback', require('../controllers/callback'));

// protected routes
router.use('/artists', authMiddleware, require('./artists'));
router.use('/me', authMiddleware, require('./me'));
router.use('/playlists', authMiddleware, require('./playlists'));
router.use('/search', authMiddleware, require('../controllers/search'));

module.exports = router;
