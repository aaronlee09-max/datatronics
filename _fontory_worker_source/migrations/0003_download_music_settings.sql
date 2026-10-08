-- Additive music settings for download progress audio.
-- Existing global_music row is preserved unchanged.
ALTER TABLE app_settings ADD COLUMN setting_value TEXT;

INSERT OR IGNORE INTO app_settings (setting_key, music_id, setting_value, updated_at)
VALUES ('download_music_mode', NULL, 'admin-selected', CAST(strftime('%s','now') AS INTEGER) * 1000);

INSERT OR IGNORE INTO app_settings (setting_key, music_id, setting_value, updated_at)
VALUES ('download_music', NULL, NULL, CAST(strftime('%s','now') AS INTEGER) * 1000);
