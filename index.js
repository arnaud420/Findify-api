const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { DB_URL, FRONT_URI } = require('./config');

const app = express();
const PORT = process.env.PORT || 3003;

app.set('trust proxy', true)

// ------------------------------------------------ Middlewares
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// ---------------------------------------- API Protection with Helmet
app.use(helmet());

// ----------------------------- Allow cross-origin resource sharing
app.use(cors({
  origin: FRONT_URI,
  credentials: true,
}));

// ------------------------------------------------ Routes
app.use('/', require('./routes'));

// -------------------------------------------------- Start Server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT} ...`);
});

// ------------------------------------------------ DB Connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to mongodb database'));
db.on('error', (error) => console.error(error));
