import { NextFunction, Request, Response } from 'express';
import knex from '../config/db';
import { DBAdmin } from '../interfaces';

export default async (req: Request, res: Response, next: NextFunction) => {
  const [manager]: Array<DBAdmin> = await knex('admin').where({ userUid: req.auth.uid });
  if(!manager) return res.send(false);
  next();
}