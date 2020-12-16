module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    spotifyId: DataTypes.STRING,
    score: DataTypes.INTEGER,
  }, {});

  Track.associate = (models) => {
    Track.belongsTo(models.User);
  };

  return Track;
};
