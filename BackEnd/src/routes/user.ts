import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../config/db';
import CONF from '../config';
import crypto from 'crypto';
import { DBLikes, DBLinks, DBUser } from '../interfaces';

const router = Router();

router
.post('/changePwd', async (req: Request, res: Response) => {
  const { password, changePassword } = req.body;

  const [info]: Array<DBUser> = await knex('users').where({ uid: req.auth.uid });
  if(!info) return res.status(400).json({ success: false, message: "유저 정보를 찾을 수 없어요." });
  if(info.signUpPath !== 'darlink') return res.status(400).json({ success: false, message: "달링 회원유저만 비밀번호 변경 서비스를 이용할 수 있어요." });

  if(crypto.createHash('sha512').update(password + info.passwordSalt).digest('hex') === info.password) {
    const passwordSalt = Math.random().toString(16).slice(2) + Math.random().toString(36).slice(2);
    const hashPassword = crypto.createHash('sha512').update(changePassword + passwordSalt).digest('hex');

    await knex('users').update({
      password: hashPassword,
      passwordSalt
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ success: false, message: "비밀번호 변경하는 과정에서 에러가 발생했어요." });
    });

    res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
  }
})
.post('/changePwd/tem', async (req: Request, res: Response) => {
  const { password } = req.body;

  const passwordSalt = Math.random().toString(16).slice(2) + Math.random().toString(36).slice(2);
  const hashPassword = crypto.createHash('sha512').update(password + passwordSalt).digest('hex');  // 보안 강화를 위해 비밀번호 salt 추가

  await knex('users').update({
    forgetPwdStatus: JSON.stringify(false),  // 비밀번호 잊음 상태  false 로 변경
    temporaryPassword: '',   // 임시 비밀번호 공백으로 초기화
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

.get('/likes', async (req: Request, res: Response) => {
  const likes: Array<DBLikes> = await knex('likes').where({ userUid: req.auth.uid });
  if(!likes) return res.status(200).json({ likes: [] });

  const links: Array<DBLinks> = await knex('links')
  .whereIn('uid', [...likes.map(data => { return data.linkUid })]);

  res.status(200).json({ links });
})

export default router;