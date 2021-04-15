const axios = require('axios');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const User = require('../models/User');

const { spotify } = config;

const getSpotifyUser = async () => {
  try {
    const { data } = await axios.get(`${spotify.API_URL}/me`);
    const user = await User.findOne({ spotifyId: data.id }).exec();

    if (!user) {
      throw new Error('No user found');
    }

    data.docId = user.id;
    return data;
  } catch (error) {
    throw error;
  }
}

const requestAccessToken = async (refreshToken) => {
  try {
    setAuthorizationToken();
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', spotify.CLIENT_ID);

    const config = {
      headers: {
        Authorization: `Basic ${Buffer.from(`${spotify.CLIENT_ID}:${spotify.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    const { data } = await axios.post(`${spotify.url}/api/token`, params, config);
    setAuthorizationToken(`${data.token_type} ${data.access_token}`);
    return data;
  } catch (error) {
    throw error;
  }
}

const withAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('No token found');
    }

    setAuthorizationToken(req.headers.authorization);
    const user = await getSpotifyUser();
    req.currentUser = user;
    return next();
  } catch (error) {
    // The access token expired, get new token by providing refresh token
    // Then update user token and send it to the front to save it in cookies
    if (error.response && error.response.data && error.response.data.error &&
      error.response.data.error.status === 401 &&
      error.response.data.error.message.toLowerCase() === 'the access token expired') {
      try {
        const accessToken = req.headers.authorization.split('Bearer ')[1];
        const user = await User.findOne({ accessToken }).exec();
        const data = await requestAccessToken(user.refreshToken);
        user.accessToken = data.access_token;
        await user.save();
        return res.json({ success: true, data });
      } catch (error) {
        return res.status(401).json({ success: false, error: error.message });
      }
    }

    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = withAuth;
