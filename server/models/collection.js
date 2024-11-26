'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: {
          type: DataTypes.TEXT,
      },
  });

  Collection.associate = (models) => {
      Collection.belongsToMany(models.Image, {
          through: models.CollectionImage,
          foreignKey: 'collectionId',
      });
  };

  return Collection;
};
