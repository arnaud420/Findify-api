const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3003;

// ------------------------------------------------ Middlewares
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// ---------------------------------------- API Protection with Helmet
app.use(helmet());

// ----------------------------- Allow cross-origin resource sharing
app.use(cors());

// ------------------------------------------------ Routes
app.use('/', require('./routes'));

// -------------------------------------------------- Start Server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT} ...`);
});
