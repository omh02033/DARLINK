import App from './app';
import './config/env';

declare global {
  namespace Express {
    interface Request {
      auth: {
        uid: number;
        userId: string;
        signUpPath: string;
        name: string;
      }
    }
  }
}

// env 정상작동 확인
if (!process.env.DATABASE_HOST) {
  console.log('env configuration required.');
} else {
  App.listen(process.env.WEB_PORT, () => {
    console.log('Connected');
  });
}