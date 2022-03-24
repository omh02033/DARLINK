import './env';
import { Algorithm } from 'jsonwebtoken';

const alg: Algorithm = 'HS512';

// 기본 설정 파일
export default {
  jwt: {  // 토큰 관련 설정
    key: process.env.JWT_KEY!,
    options: {
      expiresIn: '14d',
      algorithm: alg
    }
  },
  db: {  // 데이터베이스 관련 설정
    host: process.env.DATABASE_HOST!,
    port: process.env.DATABASE_PORT!,
    database: process.env.DATABASE_DATABASE!,
    user: process.env.DATABASE_USER!,
    pwd: process.env.DATABASE_PASSWORD!
  },
  passport: {  // 소셜로그인 관련 설정  (카카오 로그인)
    clientId: process.env.K_PASSPORT_CLIENT_ID!,
    secretId: process.env.K_PASSPORT_CLIENT_SECRET!
  },
  email: {  // 이메일 관련 설정
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID!,
      pass: process.env.EMAIL_PASSWD!
    }
  },
  backBaseURL: process.env.BACK_BASE_URL!,
  baseURL: process.env.BASE_URL!
}