const axios = require('axios');
const Cookies = require('cookies');
const config = require('../config');
const { setAuthorizationToken } = require('../helpers/function');
const User = require('../models/User');

const { spotify } = config;

const withAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('No token found');
    }
    setAuthorizationToken(req.headers.authorization);

    const { data } = await axios.get(`${spotify.API_URL}/me`);

    const user = await User.findOne({ spotifyId: data.id }).exec();

    if (!user) {
      throw new Error('No user found');
    }

    data.docId = user.id;
    req.currentUser = data;
    return next();
  } catch (error) {
    if (error.message === 'No token found') {
      return res.json({ success: false, error: 'Unauthorized' });
    }
    const cookies = new Cookies(req, res);
    cookies.set('access_token');
    cookies.set('refresh_token');
    setAuthorizationToken();
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = withAuth;
