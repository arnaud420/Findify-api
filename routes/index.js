const express = require('express');

const router = express.Router();

// postgresql
router.use('/admins', requireJwtAuth, require('./postgresql/admins'));

module.exports = router;
