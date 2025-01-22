'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Reverts the migration by dropping the 'users' table.
 *
 * @param {object} queryInterface - The interface used to communicate with the database.
 * @param {object} Sequelize - The Sequelize library for defining data types.
 * @returns {Promise<void>} - A promise that resolves when the table is dropped.
 */

/******  287a3ebd-8f28-47d0-a264-36fd575001c6  *******/  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('users');
  },
};