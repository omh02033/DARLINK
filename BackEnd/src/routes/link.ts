import { Router, Request, Response } from 'express';
import knex from '../config/db';
import CONF from '../config';
import multer from 'multer';
import fs from 'fs';
import { DBLinks } from '../interfaces';

interface boardId {
  Auto_increment: number;
}

const imgStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const [nextBoardId]: Array<boardId> = await knex('information_schema.tables').select('Auto_increment').where({
      table_schema: CONF.db.database,
      table_name: 'links'
    });
    const path = __dirname + `/../uploads/${nextBoardId.Auto_increment}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, `${path}/`);
  },
  filename: function (req, file, cb) { cb(null, file.originalname); }
});
const imgUpload = multer({ storage: imgStorage });

const router = Router();

router
.post('/', imgUpload.single('file'), async (req: Request, res: Response) => {
  const { url, fileWhether, imgUrl, location, field, isDeli, isDirect } = req.body;

  const [links]: Array<DBLinks> = await knex('links').where({ url });
  if(links) return res.status(400).json({ success: false, message: '이미 등록하시려는 링크가 존재합니다.' });

  let datas;
  if(JSON.parse(fileWhether))
    datas = {
      url,
      image: req.file?.path.substring(req.file.path.indexOf('uploads')+'uploads'.length, req.file.path.length),
      ...(JSON.parse(isDirect) && {location, field: 'direct'}),
      ...(JSON.parse(isDeli) && {field: 'delivery'}),
      tag: field,
    }
  else
    datas = {
      url,
      image: imgUrl,
      ...(JSON.parse(isDirect) && {location, field: 'direct'}),
      ...(JSON.parse(isDeli) && {field: 'delivery'}),
      tag: field
    }

  await knex('links').insert(datas)
  .catch(err => {
    console.log(err);
    res.status(500).json({ success: false, message: '알 수 없는 에러가 발생했습니다.' });
  });
  res.status(200).json({ success: true });
})

export default router;