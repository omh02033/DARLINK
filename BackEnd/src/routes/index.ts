import { Express } from 'express';
import authRouter from './auth';
import userRouter from './user';
import needAuth from '../middleware/needAuth';

export default (app: Express): void => {
  app.use('/auth', authRouter);
  app.use('/user', needAuth, userRouter);
}