'use strict'
const { v4: uuidv4 } = require('uuid')
const bycrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@mail.com',
      password: bycrypt.hashSync('mimin', 8),
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
