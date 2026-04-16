-- Migration: Create activity_notification_logs table
-- Run with: cd server && node migrations/run_migration.js

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS activity_notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_notification_logs_activity_id ON activity_notification_logs(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_notification_logs_user_id ON activity_notification_logs(user_id);

-- Verification query
SELECT 'activity_notification_logs table created' AS status;