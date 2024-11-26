'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Initialize Sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || config.database,
    process.env.DB_USER || config.username,
    process.env.DB_PASSWORD || config.password,
    {
      host: process.env.DB_HOST || config.host,
      dialect: process.env.DB_DIALECT || config.dialect,
      port: process.env.DB_PORT || config.port,
      logging: process.env.DB_LOGGING === 'true' ? console.log : config.logging,
      ...config // Ensure other config options (like pool settings) are used
    }
  );
}

// Dynamically import all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && // Exclude hidden files
      file !== basename && // Exclude this file (index.js)
      file.slice(-3) === '.js' && // Only include .js files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add Sequelize and sequelize instances to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
