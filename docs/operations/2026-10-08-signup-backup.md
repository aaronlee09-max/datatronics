# Fontory 운영 회원가입 백업 — 2026-10-08

## 운영 상태
- Worker: fontory-api
- 활성 Worker 버전: abc3794c-c4db-40d3-afed-1845bce83003
- 배포 ID: 7918821a-d23d-4b00-be38-f05886bf7712
- D1 기존 계정: 106개
- 운영 D1 백업 원본: GitHub에 업로드하지 않음

## D1 스키마 마이그레이션
accounts.status 제약을 다음과 같이 변경:
```sql
CHECK (status IN ('managed', 'pending', 'rejected'))
```

기존 FK 유지:
- mfa_codes.account_id
- mfa_pending.account_id
- sessions.account_id

foreign_key_check: 통과

## 원본 백업 무결성
SHA-256:
fb50fa7329d32853f17192d70a482f77d8bcfb569b737fd8c2868a81ac7ae1eb

## 회원가입 운영 검증
- 잘못된 입력: HTTP 400
- 정상 가입: HTTP 201
- pending 저장: 확인
- pending 로그인 차단: HTTP 403
- 비인증 승인 API: HTTP 401
- 기존 /api/auth/me: HTTP 401
- 기존 /api/music: HTTP 200
- CORS OPTIONS: HTTP 204
- 테스트 계정 삭제: 완료

## 이메일
가입 승인 알림 대상:
aaronshlee.kr@gmail.com

현재 SMTP 발송 코드와 SMTP secrets는 Worker에 존재하지만 최근 가입 테스트에서:
emailSent=false

따라서 이메일 전달은 별도 재검증 필요.

## 보안
원본 D1 SQL 백업에는 계정 데이터가 포함될 수 있으므로 GitHub에 저장하지 않는다.
