const generatePlaylist = require('../helpers/generatePlaylist');
const User = require('../models/User');

module.exports = async (req, res) => {
  try {
    const { tracks } = req.body;
    const { docId } = req.currentUser;

    if (tracks.length < 1) {
      throw new Error('User must have at least 1 track');
    }

    const generatedPlaylist = await generatePlaylist(tracks);

    const user = await User.findOne({ '_id': docId }).exec();
    user.playlists.push({
      spotifyId: null,
      tracks: generatedPlaylist,
      generatedTracks: tracks,
    });

    await user.save();

    res.json({
      success: true,
      data: user.playlists[user.playlists.length - 1],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error });
  }
};
