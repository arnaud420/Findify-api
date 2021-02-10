const axios = require('axios');
const { spotify } = require('../config');

module.exports = {
  getOne: async (req, res) => {
    try {
      const artistSpotify = await axios.get(`${spotify.API_URL}/artists/${req.params.id}`);
      const artistName = artistSpotify.data.name.toLowerCase().replace(/\s/g, '_');
      const artistInfo = await axios.get(`https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artistName}`)
      res.json({
        spotify: artistSpotify.data,
        artistInfo: artistInfo.data
      })
    } catch (error) {
      res.json({ success: false, error });
    }
  },

}
