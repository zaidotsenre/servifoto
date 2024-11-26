'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('Images', 'altText', {
          type: Sequelize.STRING, // Keeping altText as STRING
          allowNull: true,
      });

      await queryInterface.changeColumn('Images', 'filePath', {
          type: Sequelize.TEXT, // Changing filePath to TEXT
          allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('Images', 'altText', {
          type: Sequelize.STRING(255), // Revert to original STRING
          allowNull: true,
      });

      await queryInterface.changeColumn('Images', 'filePath', {
          type: Sequelize.STRING(255), // Revert to original STRING
          allowNull: false,
      });
  },
};
