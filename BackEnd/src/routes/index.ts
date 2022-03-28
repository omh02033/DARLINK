import { Express } from 'express';
import authRouter from './auth';
import userRouter from './user';
import linkRouter from './link';
import ManageRouter from './manage';

import needAuth from '../middleware/needAuth';
import needPermision from '../middleware/needPermision';

export default (app: Express): void => {
  app.use('/auth', authRouter);
  app.use('/link', linkRouter);
  app.use('/user', needAuth, userRouter);
  app.use('/manage', needAuth, needPermision, ManageRouter);
}