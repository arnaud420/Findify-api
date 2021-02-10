const express = require('express');

const router = express.Router();
const artistController = require('../controllers/artists');

router.get('/:id', artistController.getOne);

module.exports = router;
