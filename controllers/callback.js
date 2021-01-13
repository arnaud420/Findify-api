const Cookies = require('cookies');
const axios = require('axios');
const queryString = require('query-string');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const { User } = require('../models');
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
    cookies.set('access_token', data.access_token, { httpOnly: false });
    cookies.set('refresh_token', data.refresh_token, { httpOnly: false });

    setAuthorizationToken(`Bearer ${data.access_token}`);

    const spotifyUser = await axios.get(`${spotify.API_URL}/me`);
    const user = await User.findOne({
      where: { spotifyId: spotifyUser.data.id },
    });

    if (user === null) {
      await User.create({
        name: spotifyUser.data.display_name,
        email: spotifyUser.data.email,
        avatar: spotifyUser.data.images.length >= 1 ? spotifyUser.data.images[0].url : null,
        spotifyId: spotifyUser.data.id,
      });
    }

    res.redirect(FRONT_URI + '?isAuth=1');
  } catch (error) {
    console.log('error', error);
    res.redirect(`${FRONT_URI}?${queryString.stringify({
      error: 'invalid_token',
    })}`);
  }
};
