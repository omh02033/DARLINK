import { Router, Request, Response } from 'express';
import knex from '../config/db';
import jwt from 'jsonwebtoken';
import CONF from '../config';
import { DBAdmin, DBUser, tokenInterface } from '../interfaces';
import crypto from 'crypto';
import passport from 'passport';
import mail from '../resources/mailer';

import '../resources/passport';

const router = Router();


router
.get('/login/kakao', passport.authenticate('kakao'))  // 카카오톡 로그인 연동
.get('/kakao/oauth', passport.authenticate('kakao', { session: false }), async (req: any, res: Response) => {
  const kakaoEmail = req.user._json.kakao_account.email;  // 카카오톡 이메일 불러오기
  const name = req.user._json.kakao_account.profile.nickname;  // 카카오톡 이름 불러오기
  const [user]: Array<DBUser> = await knex('users').where({ userId: kakaoEmail });  // 데이터베이스에 등록 된 카카오톡 이메일 검색
  
  let token;
  if(!user) {  // 서비스에 등록되지 않았을 때, 즉 처음으로 카카오톡 로그인 시도할 때
    await knex('users').insert({  // 데이터베이스에 추가  (회원가입)
      userId: kakaoEmail,
      name,
      signUpPath: 'kakao'  // 가입 경로 : kakao
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ success: false, message: "에러가 발생했어요." });
    });

    const [userInfo]: Array<DBUser> = await knex('users').where({ userId: kakaoEmail });  // 다시 정보 불러오기

    token = await setToken(userInfo);  // 로그인 토큰 생성
  } else {
    token = await setToken(user);  // 로그인 토큰 생성
  }
  return res.redirect(CONF.baseURL + `/setToken?token=${token}`);
})

// 달링 자체 로그인 기능 이용할 때
.post('/login', async (req: Request, res: Response) => {
  const { uid, upw } = req.body;
  if(!uid || !upw) return res.status(400).json({ success: false, message: "필드를 확인해주세요." });

  const [user]: Array<DBUser> = await knex('users').where({ userId: uid });
  if(!user) return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 일치하지 않아요." });
  // 가입경로가 달링이 아닐 때, 즉 등록 방식이 카카오 이거나, 회원이 존재하지 않을 때
  if(user.signUpPath !== 'darlink') return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 일치하지 않아요." });
  
  if(JSON.parse(user.forgetPwdStatus)) {  // 임시 비밀번호가 활성화 되어있는 상태일 때
    if(crypto.createHash('sha512').update(upw).digest('hex') === user.temporaryPassword) {  // 입력한 비밀번호가 임시비밀번호와 일치 할 때
      const token = await setToken(user);  // 로그인 토큰 생성
      return res.status(200).json({ success: true, token, temporary: true });
    }
  }

  const hashPassword = crypto.createHash('sha512').update(upw + user.passwordSalt).digest('hex');
  if(user.password === hashPassword) {  // 비밀번호가 일치할 때
    const token = await setToken(user);  // 로그인 토큰 생성
    return res.status(200).json({ success: true, token, temporary: false });
  } else return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 일치하지 않아요." });
})
// 달링 자체 회원가입
.post('/signup', async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  const [userInfo]: Array<DBUser> = await knex('users').where({ userId: email });  // 데이터베이스에 등록 된 계정정보 불러오기
  if(!userInfo) {
    const passwordSalt = Math.random().toString(16).slice(2) + Math.random().toString(36).slice(2);
    const hashPassword = crypto.createHash('sha512').update(password + passwordSalt).digest('hex');  // 비밀번호 암호화
  
    await knex('users').insert({
      userId: email,
      password: hashPassword,
      passwordSalt,
      name,
      signUpPath: 'darlink',
      forgetPwdStatus: JSON.stringify(false)
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ success: false, message: "서버에서 오류가 발생했어요." });
    });
    
    const [user]: Array<DBUser> = await knex('users').where({
      userId: email,
      password: hashPassword
    });  // 정보 다시 불러오기
  
    const token = await setToken(user);  // 로그인 토큰 생성
  
    res.status(200).json({ success: true, token });
  } else return res.status(400).json({ success: false, message: "이미 회원가입 된 이메일이에요." });  // 이미 등록된 계정일 때
})

// 비밀번호 잊음 기능을 이용할 때
.post('/forgetPwd', async (req: Request, res: Response) => {
  const { email } = req.body;

  const [user]: Array<DBUser> = await knex('users').where({ userId: email });
  if(!user) return res.status(200).json({ success: false, message: "회원가입 되지 않은 이메일이에요." });
  // 가입경로가 달링이 아닐 때
  if(user.signUpPath !== 'darlink') return res.status(200).json({ success: false, message: "달링 회원유저만 비밀번호 찾기 서비스를 이용할 수 있어요." });

  const randomPwd = Math.random().toString(36).slice(2);  // 랜덤으로 임시비밀번호 생성
  await knex('users').update({
    forgetPwdStatus: "true",
    temporaryPassword: crypto.createHash('sha512').update(randomPwd).digest('hex')
  }).where({
    userId: email
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ success: false, message: "에러가 발생했어요." });
  });  // 임시비밀번호 등록

  await mail.sendMail({   // 임시비밀번호 이메일 발송
    from: `DARLINK Team`,
    to: email,
    subject: "[DARLINK] 임시 비밀번호 전송",
    html: `<html>
    <head>
      <style>
          .container {
            width:100%;
            height:100%;
            background:#fef4ed;
            padding:40px;
          }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://i.imgur.com/fnNM8fF.png" alt="" style="width: 10%;display:block;margin:auto;">
        <h1 style="text-align:center">달링 로그인 임시 비밀번호 입니다.</h1>
        <span style="font-size:1.4em;display:block;margin:auto;text-align:center;">고객님의 임시 비밀번호는 <strong>${randomPwd}</strong>입니다.</span>
        <ul style="width:400px;color:#000000aa;padding:0;margin:auto;">
          <li>임시 비밀번호로 로그인하면, 비밀번호 변경 팝업이 나타납니다.</li>
        </ul>
      </div>
    </body>
    </html>`
  });

  res.status(200).json({ success: true });
})

.get('/isLogin', async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(200).json({
    login: false,
    data: null,
    message: "로그인 상태가 아니에요."
  });
  let decoded: tokenInterface | jwt.JwtPayload | string = jwt.verify(token, CONF.jwt.key as string);
  if (!decoded) return res.status(200).json({
    login: false,
    data: null,
    message: "토큰을 해독하는데 실패했어요."
  });
  const [data]: Array<DBUser> = await knex('users').where({
    uid: (decoded as tokenInterface).uid,
    userId: (decoded as tokenInterface).userId
  });
  if (!data) return res.status(200).json({
    login: false,
    data: null,
    message: "유저 정보를 불러오는데 실패했어요."
  });
  return res.status(200).json({
    login: true,
    data: decoded
  });
})

export default router;

async function setToken(user: DBUser) {
  const [admin]: Array<DBAdmin> = await knex('admin').where({ userUid: user.uid });
  let manager: boolean = false;
  if(!admin) manager = false;
  else manager = true;
  const token = await jwt.sign({
    uid: user.uid,
    userId: user.userId,
    name: user.name,
    signUpPath: user.signUpPath,
    manager
  }, CONF.jwt.key as string, CONF.jwt.options);

  return token;
}