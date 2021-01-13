import axios from 'axios';
import { Track } from '../models';
import config from '../config';

const { spotify } = config;

const getFavorites = async (UserId) => {
  try {
    const tracks = await Track.findAll({
      where: { UserId },
    });

    if (tracks.length >= 1) {
      const ids = tracks.map((track) => track.spotifyId);
      const { data } = await axios.get(`${spotify.API_URL}/tracks/?ids=${ids.toString()}`);
      return data.tracks.filter((d) => d !== null);
    }

    return tracks;
  } catch (error) {
    throw new Error(error);
  }
};

export default getFavorites;