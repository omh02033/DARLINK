import { Express } from 'express';
import authRouter from './auth';
import needAuth from '../middleware/needAuth';

export default (app: Express): void => {
  app.use('/auth', authRouter);
}