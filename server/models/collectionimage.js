'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CollectionImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CollectionImage.init({
    collectionId: DataTypes.INTEGER,
    imageId: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CollectionImage',
  });
  return CollectionImage;
};