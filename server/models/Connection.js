const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Connection = sequelize.define('Connection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
  },
  activityContext: {
    type: DataTypes.STRING,
    allowNull: true, // which activity brought them together
  },
}, {
  timestamps: true,
  tableName: 'connections',
  indexes: [
    { unique: true, fields: ['requesterId', 'recipientId'] },
  ],
});

module.exports = Connection;
