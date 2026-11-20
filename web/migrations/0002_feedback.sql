-- In-app feedback (Settings → Feedback & help): only what the person typed.
-- kind: problem | idea | service. email only if they want a reply. app_info is the
-- optional counts line ("Reminders on · Free · 6 subs ..."), never names or prices.
-- No IP address is stored.
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL CHECK (kind IN ('problem', 'idea', 'service')),
  message TEXT NOT NULL,
  email TEXT,
  app_info TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS feedback_created_at ON feedback (created_at);
