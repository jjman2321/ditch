-- Waitlist sign-ups (double opt-in). Only the email, where it came from, and whether they asked for the Price Hike Report.
CREATE TABLE IF NOT EXISTS waitlist (
  email TEXT PRIMARY KEY,
  source TEXT,
  report INTEGER NOT NULL DEFAULT 0,
  token TEXT NOT NULL,
  confirmed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
