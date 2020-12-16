module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    spotifyId: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {});

  User.associate = (models) => {
    User.hasMany(models.Track);
  };

  return User;
};
