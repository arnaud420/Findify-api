const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new Schema({
  spotifyId: String,
  name: String,
  tracks: [],
  generatedTracks: [],
  images: [],
  uri: String,
}, {
  timestamps: true,
});

const userSchema = new Schema({
  spotifyId: {
    type: String,
    unique: true,
    required: [true, 'spotifyId is required'],
  },
  playlists: [playlistSchema],
}, {
  timestamps: true,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
