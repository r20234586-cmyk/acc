-- ============================================================
-- Migration 001 — Add location coordinates to users & activities
-- Run this ONCE against your PostgreSQL database.
-- Safe to run multiple times (IF NOT EXISTS guards).
-- ============================================================

-- ── users table ─────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

-- ── activities table ────────────────────────────────────────
ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

-- ── google_id column (from BUG-05 fix) ──────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL UNIQUE;

-- ── Indexes for fast bounding-box queries ───────────────────
-- These let Postgres skip rows outside the lat/lon range cheaply.
CREATE INDEX IF NOT EXISTS idx_users_latitude      ON users (latitude);
CREATE INDEX IF NOT EXISTS idx_users_longitude     ON users (longitude);
CREATE INDEX IF NOT EXISTS idx_activities_latitude  ON activities (latitude);
CREATE INDEX IF NOT EXISTS idx_activities_longitude ON activities (longitude);
CREATE INDEX IF NOT EXISTS idx_activities_time      ON activities (time);

-- ── Verify columns were added ────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('users', 'activities')
  AND column_name IN ('latitude', 'longitude', 'google_id')
ORDER BY table_name, column_name;
