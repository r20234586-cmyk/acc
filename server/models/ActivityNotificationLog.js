const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActivityNotificationLog = sequelize.define('ActivityNotificationLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'activities', key: 'id' },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  timestamps: true,
  tableName: 'activity_notification_logs',
  indexes: [
    { unique: true, fields: ['activityId', 'userId'] },
  ],
});

module.exports = ActivityNotificationLog;