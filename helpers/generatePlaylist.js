const axios = require('axios');
const config = require('../config');
const { getAverageByArray } = require('./function');

const { spotify } = config;

const removeDups = (array) => array.filter((v, i, a) => a.findIndex((t) => (t.id === v.id)) === i);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const alternateByArtist = (array) => {
  let index = 0;
  const arrayLength = array.length;
  const alternate = (_array) => {
    // Search the next item different, remove and return this.
    const serchNextDifferent = (number) => {
      for (let i = index + 1; i <= arrayLength; i++) {
        if (_array[i] && _array[i].album.artists[0].id !== number) {
          return _array.splice(i, 1)[0];
        }
      }
    };

    // Search the next item different, remove and return this.
    const serchPrevDifferent = (number, currentIndex) => {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (_array[i]
          && _array[i].album.artists[0].id !== number
          && _array[i].album.artists[0].id !== _array[currentIndex].album.artists[0].id
          && number !== _array[i - 1].album.artists[0].id
          && i) {
          return _array.splice(i, 1)[0];
        }
      }
    };

    // Check if the current item and the prev are equals
    if (_array[index - 1]
      && _array[index - 1].album.artists[0].id === _array[index].album.artists[0].id) {
      const next = serchNextDifferent(_array[index].album.artists[0].id);
      if (next) {
        _array.splice(index, 0, next);
      } else {
        const prev = serchPrevDifferent(_array[index].album.artists[0].id, index);
        if (prev) {
          _array.splice(index - 1, 0, prev);
        } else {
          _array.push(_array.splice(index, 1)[0]);
        }
      }
    }

    // next
    if (arrayLength - 1 !== index) {
      index++;
      return alternate(_array);
    }
    return _array;
  };
  return alternate(array);
};

const extractPopularityAndArtists = (tracks) => {
  const obj = {
    artistIds: [],
    popularities: [],
  };

  for (let i = 0; i < tracks.length; i++) {
    obj.popularities.push(tracks[i].popularity);
    obj.artistIds.push(tracks[i].album.artists[0].id);
  }

  return obj;
};

const getClosestMatch = (array, popularity, limit) => array
  .sort((prev, next) => Math.abs(popularity - prev.popularity) - Math.abs(popularity - next.popularity))
  .splice(0, limit);

const orderByPopularity = (array) => array.sort((a, b) => a.popularity - b.popularity).reverse();

const getArtistsRelatedToArtist = (artistId) => new Promise((resolve, reject) => {
  axios.get(`${spotify.API_URL}/artists/${artistId}/related-artists`)
    .then(({ data }) => resolve(data))
    .catch((error) => reject(error));
});

const getArtistTopTracks = (artistId, market) => new Promise((resolve, reject) => {
  axios.get(`${spotify.API_URL}/artists/${artistId}/top-tracks?market=${market}`)
    .then(({ data }) => resolve(data))
    .catch((error) => reject(error));
});

const getSimilarArtists = async (artistIds, popularity) => {
  try {
    const artists = [];
    const concatenedArray = [];
    // TODO: améliorer la gestion de la limite en fonction du nombre de favoris de l'utilisateur
    const maxArtistsLimit = Math.round(20 / artistIds.length);
    const promises = artistIds.map((id) => getArtistsRelatedToArtist(id));
    const data = await Promise.all(promises);
    const similarArtists = data.map((artist) => artist.artists);
    for (let i = 0; i < similarArtists.length; i++) {
      artists.push(getClosestMatch(orderByPopularity(similarArtists[i]), popularity, maxArtistsLimit));
    }
    return concatenedArray.concat(...artists);
  } catch (error) {
    throw new Error(error);
  }
};

const getSimilarTracks = async (artists, popularity, maxTracksLimit, market) => {
  try {
    const tracks = [];
    const promises = artists.map((artist) => getArtistTopTracks(artist.id, market));
    const data = await Promise.all(promises);
    const similarTracks = data.map((track) => track.tracks);
    const concatenedArray = alternateByArtist(orderByPopularity(removeDups(tracks.concat(...similarTracks))));
    const randomClosestTracks = shuffleArray(getClosestMatch(concatenedArray, popularity, (maxTracksLimit * 2)))
      .splice(0, maxTracksLimit);
    return alternateByArtist(orderByPopularity(randomClosestTracks));
  } catch (error) {
    throw new Error(error);
  }
};

// Get average popularity from favorites tracks
// Get artists from theses favorites tracks
// Get related artists from each artists
// Sort related artists by popularity
// Get closest artists to the average popularity
// Get top tracks from each related artist
// Remove duplicate tracks
// Sort tracks by popularity
// Alternate by artist
// Select 60 tracks closest to the average popularity
// Shuffle tracks and get only 30
// Sort by popularity
// Alternate by artist

const generatePlaylist = async (tracks) => {
  try {
    const maxTracksLimit = 30;
    const obj = extractPopularityAndArtists(tracks);
    const averageTracksPopularities = getAverageByArray(obj.popularities);
    const similarArtists = await getSimilarArtists(obj.artistIds, averageTracksPopularities);
    const similarTracks = await getSimilarTracks(similarArtists, averageTracksPopularities, maxTracksLimit, 'FR');
    return similarTracks;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = generatePlaylist;
