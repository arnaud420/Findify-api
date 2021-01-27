const generatePlaylist = require('../helpers/generatePlaylist');
const { Playlist } = require('../models');

module.exports = async (req, res) => {
  try {
    const { tracks } = req.body;
    console.log('req.currentUser', req.currentUser);
    const { UserId } = req.currentUser;

    if (tracks.length < 1) {
      throw new Error('User must have at least 1 track');
    }

    const generatedPlaylist = await generatePlaylist(tracks);

    const playlist = await Playlist.create({ UserId });

    res.json({
      success: true,
      data: {
        generatedPlaylist,
        playlist,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error });
  }
};
