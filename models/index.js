import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const basename = path.basename(__filename);
const db = {};
const sequelize = new Sequelize(config.postgres);

const dirname = `${process.cwd()}/models/`;

fs
  .readdirSync(dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.User = require('./User');
// db.Track = require('./Track');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
