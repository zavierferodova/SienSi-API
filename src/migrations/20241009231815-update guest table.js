'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('guests', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('guests', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
