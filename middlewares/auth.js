const axios = require('axios');
const Cookies = require('cookies');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const { User } = require('../models');

const { spotify } = config;

const withAuth = (handler) => async (req, res) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('No token found');
    }

    setAuthorizationToken(req.headers.authorization);

    const { data } = await axios.get(`${spotify.apiUrl}/me`);

    const user = await User.findOne({
      where: { spotifyId: data.id },
    });

    req.currentUser = user;
    return handler(req, res);
  } catch (error) {
    if (error.message === 'No token found') {
      return res.json({ success: false, error: 'Unauthorized' });
    }
    const cookies = new Cookies(req, res);
    cookies.set('access_token');
    cookies.set('refresh_token');
    setAuthorizationToken();
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = withAuth;
