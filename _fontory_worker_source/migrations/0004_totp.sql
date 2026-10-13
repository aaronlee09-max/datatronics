-- TOTP(인증 앱) 2단계 인증. 추가만 하며 기존 테이블/데이터는 바꾸지 않는다.
CREATE TABLE IF NOT EXISTS totp_credentials (
  account_id      INTEGER PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  secret_enc      TEXT NOT NULL,              -- AES-GCM 암호문 (키: Worker Secret TOTP_ENC_KEY)
  enabled         INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0,1)),
  last_used_step  INTEGER,                    -- 같은 코드 재사용(리플레이) 방지
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);

-- 로그인 단계의 TOTP 입력 시도 횟수 제한용 (기존 행은 0으로 채워짐)
ALTER TABLE mfa_pending ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
