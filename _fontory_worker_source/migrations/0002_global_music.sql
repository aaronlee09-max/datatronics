CREATE TABLE IF NOT EXISTS app_settings (
  setting_key TEXT PRIMARY KEY,
  music_id TEXT,
  updated_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO app_settings (setting_key, music_id, updated_at)
VALUES ('global_music', NULL, CAST(strftime('%s','now') AS INTEGER) * 1000);
