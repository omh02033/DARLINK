import { Router, Request, Response } from 'express';
import knex from '../config/db';
import jwt from 'jsonwebtoken';
import CONF from '../config';
import { DBUser, tokenInterface } from '../interfaces';

const router = Router();


router
.get('/isLogin', async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(200).json({
    login: false,
    data: null,
    message: "로그인 상태가 아니에요."
  });
  const decoded: tokenInterface | jwt.JwtPayload | string = jwt.verify(token, CONF.jwt.key as string);
  if (!decoded) return res.status(200).json({
    login: false,
    data: null,
    message: "토큰을 해독하는데 실패했어요."
  });
  const [data]: Array<DBUser> = await knex('users').where({ user_id: (decoded as tokenInterface).uid });
  if (!data) return res.status(200).json({
    login: false,
    data: null,
    message: "유저 정보를 불러오는데 실패했어요."
  });
  res.status(200).json({
    login: true,
    data: decoded
  });
})

export default router;