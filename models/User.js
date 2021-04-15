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
  accessToken: {
    type: String,
    unique: true,
  },
  refreshToken: {
    type: String,
    unique: true,
  },
  playlists: [playlistSchema],
}, {
  timestamps: true,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
