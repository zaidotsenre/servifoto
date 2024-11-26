'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      altText: {
          type: DataTypes.STRING,
      },
      filePath: {
          type: DataTypes.TEXT,
          allowNull: false,
      },
  });

  Image.associate = (models) => {
      Image.belongsToMany(models.Collection, {
          through: models.CollectionImage,
          foreignKey: 'imageId',
      });
  };

  return Image;
};

