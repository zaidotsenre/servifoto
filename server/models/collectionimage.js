'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CollectionImage extends Model {
        static associate(models) {
            CollectionImage.belongsTo(models.Image, { foreignKey: 'imageId' });
            CollectionImage.belongsTo(models.Collection, { foreignKey: 'collectionId' });
        }
    }

    CollectionImage.init(
        {
            collectionId: DataTypes.INTEGER,
            imageId: DataTypes.INTEGER,
            order: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'CollectionImage',
        }
    );

    return CollectionImage;
};
