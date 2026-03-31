/* ═══════════════════════════════════════════════════════════════════
   ChatMessage Model
   ─────────────────────────────────────────────────────────────────
   Stores messages for activity group chats.
   Each activity has its own chat room identified by activityId.
   Only participants who have joined the activity can send/read messages.
   ═══════════════════════════════════════════════════════════════════ */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  /* Which activity's group chat this message belongs to */
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  /* The user who sent the message */
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  /* Display name snapshot (so messages still render after name changes) */
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  /* Avatar initials snapshot */
  senderAvatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  /* Message text content */
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000], // prevent empty or overly long messages
    },
  },

  /* Soft-delete: message marked as deleted but kept for conversation context */
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  timestamps: true,     // createdAt, updatedAt auto-managed
  tableName: 'chat_messages',
  indexes: [
    /* Primary query: fetch all messages for an activity ordered by time */
    { fields: ['activityId', 'createdAt'] },
    /* Lookup: all messages by a specific sender */
    { fields: ['senderId'] },
  ],
});

module.exports = ChatMessage;
