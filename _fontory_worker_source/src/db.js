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
      "SELECT username, role, status, disabled, mfa_enabled, email, created_at, updated_at FROM accounts ORDER BY username"
    )
    .all();
  return results; // password_hash는 의도적으로 SELECT하지 않음
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
