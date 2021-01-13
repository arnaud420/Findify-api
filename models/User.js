module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    spotifyId: DataTypes.STRING,
  }, {});

  User.associate = (models) => {
    User.hasMany(models.Track);
  };

  return User;
};
