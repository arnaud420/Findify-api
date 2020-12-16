const config = {
  maxFavoritesByUser: 4,

  spotify: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    stateKey: 'spotify_auth_state',
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private',
    url: 'https://accounts.spotify.com',
    apiUrl: 'https://api.spotify.com/v1',
    redirectUri: 'http://localhost:3000/api/callback/',
  },

  postgres: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_USER,
    host: 'db',
    dialect: 'postgres',
    port: 5432,
  },
};

module.exports = config;
