// DNSExit SMTP Relay(relay.dnsexit.com:587)를 통한 STARTTLS 이메일 발송.
// Cloudflare Workers `cloudflare:sockets` connect() API 사용.
// 주의: 포트 25는 Workers에서 차단되어 있으나 587(제출용 포트)은 허용됨.
import { connect } from "cloudflare:sockets";

const CRLF = "\r\n";

function b64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

class SmtpLine {
  constructor(readable) {
    this.reader = readable.getReader();
    this.buf = "";
  }
  async readLine() {
    while (!this.buf.includes("\n")) {
      const { value, done } = await this.reader.read();
      if (done) break;
      this.buf += new TextDecoder().decode(value);
    }
    const idx = this.buf.indexOf("\n");
    if (idx === -1) {
      const line = this.buf;
      this.buf = "";
      return line;
    }
    const line = this.buf.slice(0, idx);
    this.buf = this.buf.slice(idx + 1);
    return line;
  }
  // SMTP 멀티라인 응답("250-..." 다음 줄에 "250 ...")을 모두 읽어 마지막 코드까지 대기
  async readResponse() {
    let last = "";
    while (true) {
      const line = await this.readLine();
      last = line;
      // "250 " (스페이스)면 종료, "250-"면 계속
      if (/^\d{3} /.test(line) || line.trim() === "") break;
      if (!/^\d{3}-/.test(line)) break;
    }
    return last.trim();
  }
  releaseLock() {
    this.reader.releaseLock();
  }
}

async function writeCmd(writer, text) {
  await writer.write(new TextEncoder().encode(text + CRLF));
}

/**
 * @param {object} env - Worker 환경 (SMTP_USER, SMTP_PASS secrets 필요)
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
export async function sendMail(env, { to, subject, text }) {
  const host = "relay.dnsexit.com";
  const port = 587;
  const fromAddr = env.SMTP_FROM || env.SMTP_USER;

  let socket = connect({ hostname: host, port }, { secureTransport: "starttls" });
  let writer = socket.writable.getWriter();
  let reader = new SmtpLine(socket.readable);

  const expectCode = (resp, code) => {
    if (!resp.startsWith(String(code))) {
      throw new Error(`SMTP unexpected response: ${resp}`);
    }
  };

  await reader.readResponse(); // 220 greeting
  await writeCmd(writer, `EHLO fontory-worker`);
  await reader.readResponse();

  await writeCmd(writer, "STARTTLS");
  const startTlsResp = await reader.readResponse();
  expectCode(startTlsResp, 220);

  // TLS로 업그레이드 - 기존 스트림 reader/writer lock을 먼저 해제해야 함
  reader.releaseLock();
  writer.releaseLock();
  const secureSocket = socket.startTls();
  socket = secureSocket;
  writer = socket.writable.getWriter();
  reader = new SmtpLine(socket.readable);

  await writeCmd(writer, `EHLO fontory-worker`);
  await reader.readResponse();

  await writeCmd(writer, "AUTH LOGIN");
  await reader.readResponse(); // 334 username prompt
  await writeCmd(writer, b64(env.SMTP_USER));
  await reader.readResponse(); // 334 password prompt
  await writeCmd(writer, b64(env.SMTP_PASS));
  const authResp = await reader.readResponse();
  expectCode(authResp, 235);

  await writeCmd(writer, `MAIL FROM:<${fromAddr}>`);
  expectCode(await reader.readResponse(), 250);

  await writeCmd(writer, `RCPT TO:<${to}>`);
  expectCode(await reader.readResponse(), 250);

  await writeCmd(writer, "DATA");
  expectCode(await reader.readResponse(), 354);

  const message =
    `From: Fontory <${fromAddr}>${CRLF}` +
    `To: <${to}>${CRLF}` +
    `Subject: ${subject}${CRLF}` +
    `Content-Type: text/plain; charset=utf-8${CRLF}${CRLF}` +
    `${text}${CRLF}.`;
  await writeCmd(writer, message);
  expectCode(await reader.readResponse(), 250);

  await writeCmd(writer, "QUIT");
  try {
    await socket.close();
  } catch {
    /* ignore */
  }
}

export async function sendMfaCodeEmail(env, to, code) {
  await sendMail(env, {
    to,
    subject: "[Fontory] 로그인 인증 코드",
    text: `Fontory 로그인 인증 코드: ${code}\n\n이 코드는 ${env.MFA_TTL_MINUTES || 5}분간 유효하며, 1회만 사용할 수 있습니다.\n요청하지 않으셨다면 이 메일을 무시하세요.`,
  });
}
