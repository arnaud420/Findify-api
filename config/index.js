const config = {
  FRONT_URI: process.env.FRONT_URI,
  DB_URL: process.env.DB_URL,

  spotify: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    stateKey: 'spotify_auth_state',
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private',
    url: 'https://accounts.spotify.com',
    API_URL: 'https://api.spotify.com/v1',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  },
};

module.exports = config;
