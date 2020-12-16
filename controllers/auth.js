const Cookies = require('cookies');
const queryString = require('query-string');
const { setAuthorizationToken, generateRandomString } = '../helpers/function';
const config = '../config';

const { spotify } = config;
const { CLIENT_ID } = config;

module.exports = {
  login: (req, res) => {
    try {
      const state = generateRandomString(16);
      const cookies = new Cookies(req, res);
      cookies.set(spotify.stateKey, state);
      res.redirect(`${spotify.url}/authorize?${queryString.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: spotify.scope,
        redirect_uri: spotify.redirectUri,
        state,
      })}`);
    } catch (error) {
      res.redirect(`/?${queryString.stringify({
        error: 'state_mismatch',
      })}`);
    }
  },

  logout: (req, res) => {
    try {
      const cookies = new Cookies(req, res);
      cookies.set('access_token');
      cookies.set('refresh_token');
      setAuthorizationToken();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
