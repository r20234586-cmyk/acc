const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('sports', 'music', 'study', 'fitness', 'gaming', 'social'),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ── Coordinates for proximity search ──
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  distance: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hostId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  hostAvatar: {
    type: DataTypes.STRING,
  },
  max: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  joined: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  color: {
    type: DataTypes.STRING,
  },
  attendees: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'activities',
});

module.exports = Activity;

/* ── Associations ──────────────────────────────────────────────────────
   Activity belongs to User (as host).
   Called from server.js after all models are loaded.
   This enables the include: [{ model: User, as: 'host' }] in queries.
   ────────────────────────────────────────────────────────────────── */
Activity.associate = function(models) {
  Activity.belongsTo(models.User, { foreignKey: 'hostId', as: 'host' });
};
