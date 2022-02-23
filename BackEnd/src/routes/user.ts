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
  const hashPassword = crypto.createHash('sha512').update(password + passwordSalt).digest('hex');

  switch(field) {
    case 'temporary':
      await knex('users').update({
        forgetPwdStatus: JSON.stringify(false),
        temporaryPassword: '',
        password: hashPassword,
        passwordSalt
      }).where({
        uid: req.auth.uid,
        userId: req.auth.userId
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, message: "에러가 발생했어요." });
      });
      break;
  }

  res.status(200).json({ success: true });
})

export default router;