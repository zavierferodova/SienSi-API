'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      attendance.belongsTo(models.session)
      attendance.belongsTo(models.guest)
    }
  }
  attendance.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    guestId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'attendance'
  })
  return attendance
}
