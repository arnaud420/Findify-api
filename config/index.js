const config = {
  maxFavoritesByUser: 4,

  FRONT_URI: 'http://localhost:3000',

  spotify: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    stateKey: 'spotify_auth_state',
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private',
    url: 'https://accounts.spotify.com',
    API_URL: 'https://api.spotify.com/v1',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  },

  postgres: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  },
};

module.exports = config;
