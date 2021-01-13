import axios from 'axios';
import config from '../config';

const { spotify } = config;

module.exports = {
  search = async (req, res) => {
    try {
      const { data } = await axios.get(`${spotify.API_URL}/search?q=${req.body.search.toString()}&type=track`);
      res.json({ success: true, data: data || null });
    } catch (error) {
      res.json({ success: false, error });
    }
  }
}
