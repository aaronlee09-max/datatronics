// D1 접근 계층 - 모든 쿼리는 바인딩 파라미터만 사용 (SQL Injection 방지)

export function now() {
  return Date.now();
}

export async function getAccountByUsername(db, username) {
  return db.prepare("SELECT * FROM accounts WHERE username = ?").bind(username).first();
}

export async function getAccountById(db, id) {
  return db.prepare("SELECT * FROM accounts WHERE id = ?").bind(id).first();
}

export async function listAccounts(db) {
  const { results } = await db
    .prepare(
      "SELECT id, username, role, status, disabled, mfa_enabled, email, created_at, updated_at FROM accounts ORDER BY username"
    )
    .all();
  const totpCounts = await listTotpDeviceCounts(db);
  for (const row of results) {
    row.skip_wait = await getSkipWait(db, row.username);
    row.totp_count = totpCounts.get(row.id) || 0;
    row.totp_enabled = row.totp_count > 0;
    delete row.id; // 내부 ID는 응답에 노출하지 않음
  }
  return results; // password_hash는 의도적으로 SELECT하지 않음
}

// 다운로드 대기 건너뛰기 설정 (운영 Worker와 동일: app_settings의 skip_wait:<username>)
export async function getSkipWait(db, username) {
  const row = await db.prepare("SELECT setting_value FROM app_settings WHERE setting_key = ?").bind("skip_wait:" + username).first();
  return row ? String(row.setting_value) === "1" : username.toLowerCase() === "htxoh";
}

export async function countAdmins(db, excludeId = null) {
  const row = excludeId
    ? await db
        .prepare("SELECT COUNT(*) AS c FROM accounts WHERE role = 'admin' AND disabled = 0 AND id != ?")
        .bind(excludeId)
        .first()
    : await db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE role = 'admin' AND disabled = 0").first();
  return row.c;
}

export async function createAccount(db, { username, passwordHash, role, email }) {
  const t = now();
  return db
    .prepare(
      `INSERT INTO accounts (username, password_hash, role, status, disabled, mfa_enabled, email, created_at, updated_at)
       VALUES (?, ?, ?, 'managed', 0, 0, ?, ?, ?)`
    )
    .bind(username, passwordHash, role || "user", email || null, t, t)
    .run();
}

export async function updatePasswordHash(db, username, passwordHash) {
  return db
    .prepare("UPDATE accounts SET password_hash = ?, updated_at = ? WHERE username = ?")
    .bind(passwordHash, now(), username)
    .run();
}

export async function updatePasswordHashById(db, accountId, passwordHash) {
  return db
    .prepare("UPDATE accounts SET password_hash = ?, updated_at = ? WHERE id = ?")
    .bind(passwordHash, now(), accountId)
    .run();
}

export async function updateAccountEmail(db, accountId, email) {
  return db
    .prepare("UPDATE accounts SET email = ?, updated_at = ? WHERE id = ?")
    .bind(email || null, now(), accountId)
    .run();
}

export async function setDisabled(db, username, disabled) {
  return db
    .prepare("UPDATE accounts SET disabled = ?, updated_at = ? WHERE username = ?")
    .bind(disabled ? 1 : 0, now(), username)
    .run();
}

export async function deleteAccountByUsername(db, username) {
  return db.prepare("DELETE FROM accounts WHERE username = ?").bind(username).run();
}

export async function recordFailedLogin(db, accountId, lockThreshold, lockMinutes) {
  const acc = await getAccountById(db, accountId);
  const attempts = (acc.failed_attempts || 0) + 1;
  let lockedUntil = acc.locked_until;
  if (attempts >= lockThreshold) {
    lockedUntil = now() + lockMinutes * 60_000;
  }
  await db
    .prepare("UPDATE accounts SET failed_attempts = ?, locked_until = ? WHERE id = ?")
    .bind(attempts, lockedUntil, accountId)
    .run();
}

export async function resetFailedLogins(db, accountId) {
  await db
    .prepare("UPDATE accounts SET failed_attempts = 0, locked_until = NULL WHERE id = ?")
    .bind(accountId)
    .run();
}

// ---- Sessions ----

export async function createSession(db, accountId, tokenHash, ttlMinutes) {
  const t = now();
  return db
    .prepare(
      "INSERT INTO sessions (account_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(accountId, tokenHash, t + ttlMinutes * 60_000, t)
    .run();
}

export async function getValidSessionByTokenHash(db, tokenHash) {
  return db
    .prepare(
      "SELECT * FROM sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?"
    )
    .bind(tokenHash, now())
    .first();
}

export async function revokeSessionByTokenHash(db, tokenHash) {
  return db
    .prepare("UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL")
    .bind(now(), tokenHash)
    .run();
}

// ---- MFA ----

export async function revokeAllSessions(db, accountId) {
  return db.prepare("UPDATE sessions SET revoked_at = ? WHERE account_id = ? AND revoked_at IS NULL").bind(now(), accountId).run();
}

export async function createMfaCode(db, accountId, codeHash, ttlMinutes, purpose = "login") {
  const t = now();
  return db
    .prepare(
      "INSERT INTO mfa_codes (account_id, code_hash, purpose, expires_at, used, attempts, created_at) VALUES (?, ?, ?, ?, 0, 0, ?)"
    )
    .bind(accountId, codeHash, purpose, t + ttlMinutes * 60_000, t)
    .run();
}

export async function getLatestActiveMfaCode(db, accountId, purpose = "login") {
  return db
    .prepare(
      `SELECT * FROM mfa_codes WHERE account_id = ? AND purpose = ? AND used = 0 AND expires_at > ?
       ORDER BY id DESC LIMIT 1`
    )
    .bind(accountId, purpose, now())
    .first();
}

export async function markMfaCodeUsed(db, id) {
  return db.prepare("UPDATE mfa_codes SET used = 1 WHERE id = ?").bind(id).run();
}

export async function incrementMfaAttempts(db, id) {
  return db.prepare("UPDATE mfa_codes SET attempts = attempts + 1 WHERE id = ?").bind(id).run();
}

export async function countRecentMfaCodes(db, accountId, sinceMs, purpose = "login") {
  const row = await db
    .prepare("SELECT COUNT(*) AS c FROM mfa_codes WHERE account_id = ? AND purpose = ? AND created_at > ?")
    .bind(accountId, purpose, sinceMs)
    .first();
  return row.c;
}

export async function createMfaPending(db, accountId, pendingHash, ttlMinutes) {
  const t = now();
  return db
    .prepare("INSERT INTO mfa_pending (account_id, pending_hash, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .bind(accountId, pendingHash, t + ttlMinutes * 60_000, t)
    .run();
}

export async function getValidMfaPending(db, pendingHash) {
  return db
    .prepare("SELECT * FROM mfa_pending WHERE pending_hash = ? AND expires_at > ?")
    .bind(pendingHash, now())
    .first();
}

export async function deleteMfaPending(db, id) {
  return db.prepare("DELETE FROM mfa_pending WHERE id = ?").bind(id).run();
}


// ---- Global music setting ----


export async function getMusicSettings(db) {
  const { results } = await db
    .prepare("SELECT setting_key, music_id, setting_value FROM app_settings WHERE setting_key IN ('global_music', 'download_music', 'download_music_mode')")
    .all();
  return results || [];
}

export async function setAppSetting(db, settingKey, musicId = null, settingValue = null) {
  const t = now();
  return db
    .prepare("INSERT INTO app_settings (setting_key, music_id, setting_value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(setting_key) DO UPDATE SET music_id = excluded.music_id, setting_value = excluded.setting_value, updated_at = excluded.updated_at")
    .bind(settingKey, musicId, settingValue, t)
    .run();
}

export async function getMusicSetting(db) {
  return db
    .prepare("SELECT music_id FROM app_settings WHERE setting_key = 'global_music' LIMIT 1")
    .first();
}

export async function setMusicSetting(db, musicId) {
  return setAppSetting(db, "global_music", musicId, null);
}

// ---- TOTP (인증 앱) : 계정당 여러 기기 ----
// 마이그레이션 0005가 아직 적용되지 않은 DB에서도 기존 로그인이 깨지지 않도록
// 조회는 "테이블 없음"을 TOTP 미사용으로 취급한다.

function noTable(e) {
  return String(e && e.message).includes("no such table");
}

// 켜진(확인 완료) 기기 목록
export async function listTotpDevices(db, accountId) {
  try {
    const { results } = await db
      .prepare("SELECT id, label, secret_enc, last_used_step, created_at FROM totp_devices WHERE account_id = ? AND enabled = 1 ORDER BY id")
      .bind(accountId)
      .all();
    return results || [];
  } catch (e) {
    if (noTable(e)) return [];
    throw e;
  }
}

export async function getTotpDevice(db, accountId, id) {
  try {
    return await db.prepare("SELECT * FROM totp_devices WHERE account_id = ? AND id = ?").bind(accountId, id).first();
  } catch (e) {
    if (noTable(e)) return null;
    throw e;
  }
}

// 등록 중(미확인)이던 키는 정리하고 새 키를 하나 만든다. 새 기기의 id 를 반환.
export async function createPendingTotpDevice(db, accountId, label, secretEnc) {
  const t = now();
  await db.prepare("DELETE FROM totp_devices WHERE account_id = ? AND enabled = 0").bind(accountId).run();
  const res = await db
    .prepare("INSERT INTO totp_devices (account_id, label, secret_enc, enabled, last_used_step, created_at, updated_at) VALUES (?, ?, ?, 0, NULL, ?, ?)")
    .bind(accountId, label, secretEnc, t, t)
    .run();
  return res.meta && res.meta.last_row_id;
}

export async function enableTotpDevice(db, accountId, id, step) {
  const res = await db
    .prepare("UPDATE totp_devices SET enabled = 1, last_used_step = ?, updated_at = ? WHERE account_id = ? AND id = ? AND enabled = 0")
    .bind(step, now(), accountId, id)
    .run();
  return (res.meta && res.meta.changes) === 1;
}

// 같은 기기에서 같은 step 이하의 코드는 다시 쓸 수 없다. 동시에 두 요청이 와도 하나만 성공한다.
export async function consumeTotpDeviceStep(db, id, step) {
  const res = await db
    .prepare(
      "UPDATE totp_devices SET last_used_step = ?, updated_at = ? WHERE id = ? AND enabled = 1 AND (last_used_step IS NULL OR last_used_step < ?)"
    )
    .bind(step, now(), id, step)
    .run();
  return (res.meta && res.meta.changes) === 1;
}

export async function deleteTotpDevice(db, accountId, id) {
  return db.prepare("DELETE FROM totp_devices WHERE account_id = ? AND id = ?").bind(accountId, id).run();
}

// 관리자 초기화 / 일괄 삭제 (미완료 키 포함)
export async function deleteAllTotp(db, accountId) {
  try {
    return await db.prepare("DELETE FROM totp_devices WHERE account_id = ?").bind(accountId).run();
  } catch (e) {
    if (noTable(e)) return null;
    throw e;
  }
}

export async function incrementPendingAttempts(db, id) {
  return db.prepare("UPDATE mfa_pending SET attempts = attempts + 1 WHERE id = ?").bind(id).run();
}

// 관리자 계정 목록에 인증 앱 등록 수를 표시하기 위한 조회 (테이블이 없으면 빈 맵)
export async function listTotpDeviceCounts(db) {
  try {
    const { results } = await db.prepare("SELECT account_id, COUNT(*) AS n FROM totp_devices WHERE enabled = 1 GROUP BY account_id").all();
    return new Map((results || []).map((r) => [r.account_id, r.n]));
  } catch (e) {
    if (noTable(e)) return new Map();
    throw e;
  }
}
