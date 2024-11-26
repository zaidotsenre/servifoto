'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
      await queryInterface.bulkInsert('Collections', [
          { name: 'Nature', description: 'Beautiful nature images', createdAt: new Date(), updatedAt: new Date() },
          { name: 'Cities', description: 'Urban cityscapes', createdAt: new Date(), updatedAt: new Date() },
      ]);
  },

  down: async (queryInterface) => {
      await queryInterface.bulkDelete('Collections', null, {});
  },
};
