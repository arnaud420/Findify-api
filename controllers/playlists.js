const User = require('../models/User');

module.exports = {
  getAll: async (req, res) => {
    try {
      const data = req.currentUser;
      res.json({ success: true, data: data || null });
    } catch (error) {
      res.json({ success: false, error });
    }
  },

  getOne: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.currentUser.docId }).exec();
      const playlist = user.playlists.find((p) => p._id.toString() === req.params.id.toString());
      res.json({ success: true, data: playlist || null });
    } catch (error) {
      res.json({ success: false, error });
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.currentUser.docId }).exec();
      const playlist = user.playlists.find((p) => p._id.toString() === req.params.id.toString());
      Object.keys(req.body).map((key) => {
        playlist[key] = req.body[key];
      });

      user.playlists = [
        playlist,
        ...user.playlists
      ];

      await user.save();
      res.json({ success: true, data: playlist || null });
    } catch (error) {
      res.json({ success: false, error });
    }
  },

}
