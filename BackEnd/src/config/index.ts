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
  }
}