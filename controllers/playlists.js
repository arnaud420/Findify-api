const User = require('../models/User');
const { savePlaylistToSpotify } = require('../helpers/spotify');

const getUserPlaylist = async (userId, playlistId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    const playlist = user.playlists.find((p) => p._id.toString() === playlistId.toString());

    if (playlist === null) {
      throw new Error('Playlist not found')
    }

    return { user, playlist };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.currentUser.docId }).exec();
      res.json({ success: true, data: user.playlists || null });
    } catch (error) {
      res.status(error.status || 500).json({ success: false, error });
    }
  },

  getOne: async (req, res) => {
    try {
      const { playlist } = await getUserPlaylist(req.currentUser.docId, req.params.id);
      res.json({ success: true, data: playlist || null });
    } catch (error) {
      res.status(error.status || 500).json({ success: false, error });
    }
  },

  update: async (req, res) => {
    try {
      const { user, playlist } = await getUserPlaylist(req.currentUser.docId, req.params.id);

      Object.keys(req.body).map((key) => {
        //TODO: check le body
        console.log('key', key);
        playlist[key] = req.body[key];
      });

      user.playlists = [
        ...user.playlists.filter((p) => p._id !== playlist._id),
        playlist,
      ];

      await user.save();
      res.json({ success: true, data: playlist || null });
    } catch (error) {
      console.log('error', error);
      res.status(error.status || 500).json({ success: false, error });
    }
  },

  saveToSpotify: async (req, res) => {
    try {
      let { user, playlist } = await getUserPlaylist(req.currentUser.docId, req.params.id);
      const { data } = await savePlaylistToSpotify(user.spotifyId, playlist);

      console.log('data', data);

      playlist = {
        tracks: playlist.tracks,
        generatedTracks: playlist.generatedTracks,
        images: data.images,
        spotifyId: data.id,
        uri: data.external_urls.spotify,
        _id: playlist._id,
        createdAt: playlist.createdAt,
        name: playlist.name,
        public: data.public,
      };

      user.playlists = [
        ...user.playlists.filter((p) => p._id !== playlist._id),
        playlist,
      ];

      await user.save();
      res.json({ success: true, data: playlist || null });
    } catch (error) {
      console.log('error', error);
      res.status(error.status || 500).json({ success: false, error });
    }
  }

}
