const axios = require('axios');
const { spotify } = require('../config');

module.exports = {
  getOne: async (req, res) => {
    try {
      const artistSpotify = await axios.get(`${spotify.API_URL}/artists/${req.params.id}`);
      const artistTopTitles = await axios.get(`${spotify.API_URL}/artists/${req.params.id}/top-tracks?market=fr`);
      const artistName = artistSpotify.data.name.toLowerCase().replace(/\s/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let artistInfo = await axios.get(`https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artistName}`);

      if (artistInfo.data.artists) {
        artistInfo = artistInfo.data.artists[0];
      } else {
        artistInfo = null;
      }

      res.json({
        ...artistSpotify.data,
        ...artistTopTitles.data,
        ...artistInfo,
      })
    } catch (error) {
      console.log('error', error);
      res.json({ success: false, error });
    }
  },

}
