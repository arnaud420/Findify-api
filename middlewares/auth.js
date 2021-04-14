const axios = require('axios');
const Cookies = require('cookies');
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


// Remove token from cookies
const removeCookies = (req, res) => {
  const cookies = new Cookies(req, res);
  cookies.set('access_token');
  cookies.set('refresh_token');
  setAuthorizationToken();
}

const requestAccessToken = async (req, res, next) => {
  try {

    console.log('REQUEST ACCESS TOKEN');

    setAuthorizationToken();
    const cookies = new Cookies(req, res);
    const refreshToken = cookies.get('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token founded');
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', spotify.CLIENT_ID);

    console.log('refresh_token from cookies', refreshToken);

    const config = {
      headers: {
        Authorization: `Basic ${Buffer.from(`${spotify.CLIENT_ID}:${spotify.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    const { data } = await axios.post(`${spotify.url}/api/token`, params, config);

    if (process.env.NODE_ENV === 'production') {
      cookies.set('access_token', data.access_token, { httpOnly: false, secure: true });
    } else {
      cookies.set('access_token', data.access_token, { httpOnly: false });
    }

    setAuthorizationToken(`${data.token_type} ${data.access_token}`);

    const user = await getSpotifyUser();
    req.currentUser = user;

    return next();
  } catch (error) {
    console.log('error from requestAccessToken', error.message);
    removeCookies(req, res);
    return res.status(401).json({ success: false, error: error.message });
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
    console.log('error auth', error.message);

    // No token found
    if (error.message === 'No token found') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // The access token expired, get new token by providing refresh token
    if (error.response && error.response.data && error.response.data.error &&
      error.response.data.error.status === 401 &&
      error.response.data.error.message.toLowerCase() === 'the access token expired') {
      return await requestAccessToken(req, res, next);
    }

    // removeCookies(req, res);
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = withAuth;
