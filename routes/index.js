const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use('/auth', require('./auth'));
router.use('/callback', require('./callback'));
// router.use('/generate', authMiddleware, require('./generate'));
// router.use('/me', authMiddleware, require('./me'));
// router.use('/playlists', authMiddleware, require('./playlist'));
// router.use('/search', authMiddleware, require('./search'));

module.exports = router;
