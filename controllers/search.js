const axios = require('axios');
const config = require('../config');

const { spotify } = config;

module.exports = async (req, res) => {
  try {
    const { data } = await axios.get(`${spotify.API_URL}/search?q=${req.body.search.toString()}&type=track`);
    res.json({ success: true, data: data || null });
  } catch (error) {
    res.json({ success: false, error });
  }
}

