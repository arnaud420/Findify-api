const express = require('express');

const router = express.Router();
const playlistController = require('../controllers/playlists');

router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getOne);
router.post('/generate', playlistController.generate);
router.post('/:id/spotify', playlistController.saveToSpotify);
router.patch('/:id', playlistController.update);
router.patch('/:id/regenerate', playlistController.regenerate);

module.exports = router;
