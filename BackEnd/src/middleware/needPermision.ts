import { NextFunction, Request, Response } from 'express';
import knex from '../config/db';
import { DBAdmin } from '../interfaces';

// 관리자 권한이 필요 한 라우터일 때 호출함  ex) 링크 등록 등등 관리자만 이용할 수 있는 기능들
export default async (req: Request, res: Response, next: NextFunction) => {
  const [manager]: Array<DBAdmin> = await knex('admin').where({ userUid: req.auth.uid });
  if(!manager) return res.send(false);
  next();
}