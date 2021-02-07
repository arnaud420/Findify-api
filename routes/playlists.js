const express = require('express');

const router = express.Router();
const playlistController = require('../controllers/playlists');

router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getOne);

module.exports = router;
