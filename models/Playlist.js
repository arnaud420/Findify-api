module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    spotifyId: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {});

  Playlist.associate = (models) => {
    Playlist.belongsTo(models.User);
  };

  return Playlist;
};
