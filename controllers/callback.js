const Cookies = require('cookies');
const axios = require('axios');
const queryString = require('query-string');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const User = require('../models/User');

const { spotify, FRONT_URI } = config;
const { CLIENT_ID, CLIENT_SECRET } = spotify;

module.exports = async (req, res) => {
  try {
    console.log('callback');
    const cookies = new Cookies(req, res);
    const { code, state } = req.query;
    const storedState = cookies.get(spotify.stateKey);
    cookies.set(spotify.stateKey);

    if (state === null || state !== storedState) {
      return res.redirect(`${FRONT_URI}?${queryString.stringify({
        error: 'state_mismatch',
      })}`);
    }

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

    setAuthorizationToken(`${data.token_type} ${data.access_token}`);

    const spotifyUser = await axios.get(`${spotify.API_URL}/me`);

    const user = await User.findOne({ spotifyId: spotifyUser.data.id }).exec();

    if (user === null) {
      await new User({
        spotifyId: spotifyUser.data.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }).save();
    } else {
      user.accessToken = data.access_token;
      user.refreshToken = data.refresh_token;
      await user.save();
    }

    res.redirect(`${FRONT_URI}/?access_token=${data.access_token}`);
  } catch (error) {
    res.redirect(`${FRONT_URI}?${queryString.stringify({
      error: 'invalid_token',
    })}`);
  }
};
