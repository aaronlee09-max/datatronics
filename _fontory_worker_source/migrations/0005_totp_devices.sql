-- 계정당 여러 개의 인증 앱(TOTP 기기) 등록을 지원한다.
-- 기존 totp_credentials 는 건드리지 않는다(운영 DB에서 비어 있음). 이후 로직은 totp_devices 만 사용한다.
CREATE TABLE IF NOT EXISTS totp_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT '',
  secret_enc TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  last_used_step INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_totp_devices_account ON totp_devices(account_id);
