import { Router, Request, Response } from 'express';
import knex from '../config/db';
import CONF from '../config';
import { DBLinks, DBLikes } from '../interfaces';

const router = Router();

router
.get('/likes', async (req: Request, res: Response) => {
  const likes: Array<DBLikes> = await knex('likes').where({ userUid: req.auth.uid });
  res.status(200).json({ likes });
})

.post('/:field', async (req: Request, res: Response) => {
  try {
    const { field } = req.params;
    const { tag, page } = req.body;

    if(tag.length < 1 || !field) return res.status(200).json({ links: [] });

    const links: Array<DBLinks> = await knex('links')
    .whereIn('tag', tag)
    .andWhere('field', field)
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