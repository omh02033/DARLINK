import './env';
import { Algorithm } from 'jsonwebtoken';

const alg: Algorithm = 'HS512';

export default {
  jwt: {
    key: process.env.JWT_KEY,
    options: {
      expiresIn: '14d',
      algorithm: alg
    }
  },
  db: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_DATABASE,
    user: process.env.DATABASE_USER,
    pwd: process.env.DATABASE_PASSWORD
  },
  passport: {
    clientId: process.env.K_PASSWORD_CLIENT_ID,
    secretId: process.env.K_PASSPORT_CLIENT_SECRET
  },
  email: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWD
    }
  },
  backBaseURL: process.env.BACK_BASE_URL,
  baseURL: process.env.BASE_URL
}