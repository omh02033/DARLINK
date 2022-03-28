import { Router, Request, Response } from 'express';
import knex from '../config/db';
import CONF from '../config';
import { DBLinks, DBLikes } from '../interfaces';
import needAuth from '../middleware/needAuth';

const router = Router();

router

// 나의 like 기록 불러오기  (로그인 필요)
.get('/likes', needAuth, async (req: Request, res: Response) => {
  const likes: Array<DBLikes> = await knex('likes').where({ userUid: req.auth.uid });
  res.status(200).json({ likes });
})

// like 등록, 취소하기  (로그인 필요)
.post('/like', needAuth, async (req: Request, res: Response) => {
  const { like, uid } = req.body;

  const [link]: Array<DBLinks> = await knex('links').where({ uid });
  if(JSON.parse(like)) {   // like 가 true 일 때
    await knex('likes').insert({  // like 기록 추가
      userUid: req.auth.uid,
      linkUid: uid
    }).catch(err => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: `${link.title} 구독에 실패하였습니다.`
      });
    });
  } else {  // like 가 false 일 때
    await knex('likes').where({
      userUid: req.auth.uid,
      linkUid: uid
    }).del()   // like 기록 제거
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: `${link.title} 구독 취소에 실패하였습니다.`
      });
    });
  }

  const likes: Array<DBLikes> = await knex('likes').where({ userUid: req.auth.uid });  // 새로운 데이터 갱신
  return res.status(200).json({
    success: true,
    message: `${link.title} ${like ? '구독하였습니다.' : '구독 취소하였습니다.'}`,
    likes
  });
})

// 배송체험 링크 불러오기
.post('/delivery', async (req: Request, res: Response) => {
  try {
    const { tag, page } = req.body;

    if(tag.length < 1) return res.status(200).json({ links: [] });

    const links: Array<DBLinks> = await knex('links')
    .whereIn('tag', tag)
    .andWhere('field', 'delivery')
    .orderBy('uid', 'desc')
    .limit(12)
    .offset(page*12);
  
    res.status(200).json({ links });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: '데이터를 불러오는 중에서 에러가 발생하였습니다.' });
  }
})

// 직접체험 링크 불러오기
.post('/direct', async (req: Request, res: Response) => {
  try {
    const { tag, location, page } = req.body;

    if(tag.length < 1 || location.length < 1) return res.status(200).json({ links: [] });

    const links: Array<DBLinks> = await knex('links')
    .whereIn('tag', tag)
    .whereIn('location', location)
    .andWhere('field', 'direct')
    .orderBy('uid', 'desc')
    .limit(12)
    .offset(page*12);

    res.status(200).json({ links });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: '데이터를 불러오는 중에서 에러가 발생하였습니다.' });
  }
})

export default router;