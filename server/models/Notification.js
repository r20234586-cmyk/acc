const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('connection_request', 'activity_update', 'activity_reminder', 'new_activity'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  relatedUserId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  relatedActivityId: {
    type: DataTypes.UUID,
    references: {
      model: 'activities',
      key: 'id',
    },
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'notifications',
});

module.exports = Notification;
