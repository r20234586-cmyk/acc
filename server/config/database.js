const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || undefined,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL Connected: ${process.env.DB_HOST}`);
    
    // Import and setup model associations
    const User = require('../models/User');
    const Activity = require('../models/Activity');
    const Notification = require('../models/Notification');
    const RefreshToken = require('../models/RefreshToken');

    // User-Activity associations
    User.hasMany(Activity, { foreignKey: 'hostId', as: 'hostedActivities' });
    Activity.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

    // User-Notification associations
    User.hasMany(Notification, { foreignKey: 'userId' });
    Notification.belongsTo(User, { foreignKey: 'userId' });

    // Activity-Notification associations
    Activity.hasMany(Notification, { foreignKey: 'relatedActivityId' });
    Notification.belongsTo(Activity, { foreignKey: 'relatedActivityId' });

    // User-RefreshToken associations
    User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
    RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

    /* ── Chat message associations ──────────────────────────────────
       ChatMessage belongs to Activity (the group chat room)
       ChatMessage belongs to User (the sender)
    ────────────────────────────────────────────────────────────── */
    const ChatMessage = require('../models/ChatMessage');
    Activity.hasMany(ChatMessage, { foreignKey: 'activityId', as: 'messages' });
    ChatMessage.belongsTo(Activity, { foreignKey: 'activityId' });
    User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'sentMessages' });
    ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

    /* ── Connection associations ─────────────────────────────────────
       User sends/receives connection requests
    ────────────────────────────────────────────────────────────── */
    const Connection = require('../models/Connection');
    User.hasMany(Connection, { foreignKey: 'requesterId', as: 'sentConnections' });
    User.hasMany(Connection, { foreignKey: 'recipientId', as: 'receivedConnections' });
    Connection.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
    Connection.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
    
    return sequelize;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
