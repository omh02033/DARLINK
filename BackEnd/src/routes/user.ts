import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../config/db';
import CONF from '../config';
import crypto from 'crypto';

const router = Router();

router
.post('/changePwd', async (req: Request, res: Response) => {
  const { password, field } = req.body;

  const passwordSalt = Math.random().toString(16).slice(2) + Math.random().toString(36).slice(2);
  const hashPassword = crypto.createHash('sha512').update(password + passwordSalt).digest('hex');  // 보안 강화를 위해 비밀번호 salt 추가

  await knex('users').update({
    ...(field === 'temporary' && {   // 비밀번호 잊었을 때 추가사항
      forgetPwdStatus: JSON.stringify(false),  // 비밀번호 잊음 상태  false 로 변경
      temporaryPassword: '',   // 임시 비밀번호 공백으로 초기화
    }),
    password: hashPassword,
    passwordSalt
  }).where({
    uid: req.auth.uid,
    userId: req.auth.userId
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ success: false, message: "에러가 발생했어요." });
  });

  res.status(200).json({ success: true });
})

export default router;