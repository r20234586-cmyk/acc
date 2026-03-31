/* ═══════════════════════════════════════════════════════════════════
   ActivityCrew — Express Server Entry Point
   Boot sequence: dotenv → DB → middleware → routes → sync → listen
   ═══════════════════════════════════════════════════════════════════ */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
/* Group chat: real-time messages for activity participants */
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to PostgreSQL
connectDB();

// Middleware Stack (Order matters!)
// 1. CORS with credentials
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true, // Allow cookies
}));

// 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parsing
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
/* Group messaging endpoint: GET/POST /api/chat/:activityId/messages */
app.use('/api/chat', chatRoutes);
/* Notifications: GET/PUT /api/notifications */
app.use('/api/notifications', notificationRoutes);
/* Connections: GET/POST/PUT /api/connections */
const connectionRoutes = require('./routes/connectionRoutes');
app.use('/api/connections', connectionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler (before error handler)
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      timestamp: new Date().toISOString(),
    },
  });
});

// Global error handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Sync database and start server
// alter: true → adds new columns to existing tables without dropping data.
// Never use force: true in production (drops all tables).
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});
