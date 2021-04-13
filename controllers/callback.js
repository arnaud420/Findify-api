const Cookies = require('cookies');
const axios = require('axios');
const queryString = require('query-string');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const User = require('../models/User');
const { FRONT_URI } = require('../config');

const { spotify } = config;
const { CLIENT_ID, CLIENT_SECRET } = spotify;

module.exports = async (req, res) => {
  try {
    console.log('callback');
    const cookies = new Cookies(req, res);
    const { code, state } = req.query;
    const storedState = cookies.get(spotify.stateKey);

    if (state === null || state !== storedState) {
      cookies.set(spotify.stateKey);
      return res.redirect(`${FRONT_URI}?${queryString.stringify({
        error: 'state_mismatch',
      })}`);
    }

    cookies.set(spotify.stateKey);

    const { data } = await axios({
      method: 'post',
      url: `${spotify.url}/api/token`,
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        code,
        redirect_uri: spotify.redirectUri,
        grant_type: 'authorization_code',
      },
      json: true,
    });

    // todo: passer les tokens en httpOnly: true pour ne pas les rendre accessible au front
    const expires = new Date();
    // expires in 2 week
    expires.setDate(expires.getDate() + (2 * 7));
    cookies.set('access_token', data.access_token, { httpOnly: false, expires, secureProxy: true, secure: true, sameSite: 'none' });
    cookies.set('refresh_token', data.refresh_token, { httpOnly: false, expires, secureProxy: true, secure: true, sameSite: 'none' });

    console.log('data', data);

    setAuthorizationToken(`${data.token_type} ${data.access_token}`);

    const spotifyUser = await axios.get(`${spotify.API_URL}/me`);

    console.log('spotifyUser', spotifyUser);

    const user = await User.findOne({ spotifyId: spotifyUser.data.id }).exec();

    console.log('user', user);

    if (user === null) {
      await new User({
        spotifyId: spotifyUser.data.id,
      }).save();
    }

    res.redirect(FRONT_URI + '/playlists/create');
  } catch (error) {
    console.log('error', error);
    res.redirect(`${FRONT_URI}?${queryString.stringify({
      error: 'invalid_token',
    })}`);
  }
};
