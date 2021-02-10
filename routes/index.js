const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use('/test', authMiddleware)

router.use('/auth', require('./auth'));
router.use('/artists', require('./artists'));
router.use('/callback', require('../controllers/callback'));
router.use('/generate', authMiddleware, require('../controllers/generate'));
router.use('/me', authMiddleware, require('./me'));
router.use('/playlists', authMiddleware, require('./playlists'));
router.use('/search', authMiddleware, require('../controllers/search'));

module.exports = router;
