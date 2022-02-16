import { Router, Request, Response } from 'express';
import knex from '../config/db';
import jwt from 'jsonwebtoken';
import CONF from '../config';
import { DBUser, tokenInterface } from '../interfaces';
import crypto from 'crypto';

const router = Router();


router
.post('/login', async (req: Request, res: Response) => {
  const { uid, upw } = req.body;
  if(!uid || !upw) return res.status(400).json({ success: false, message: "필드를 확인해주세요." });

  const [user]: Array<DBUser> = await knex('users').where({ userId: uid });
  if(!user) return res.status(400).json({ success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });

  const hashPassword = crypto.createHash('sha512').update(upw + user.passwordSalt).digest('hex');
  if(user.password === hashPassword) {
    const token = await jwt.sign({
      uid: user.uid,
      userId: user.userId,
      name: user.name
    }, CONF.jwt.key as string, CONF.jwt.options);
    return res.status(200).json({ success: true, token });
  } else return res.status(400).json({ success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
})

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