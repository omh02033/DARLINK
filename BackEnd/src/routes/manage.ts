import { Router, Request, Response } from 'express';
import knex from '../config/db';
import CONF from '../config';
import multer from 'multer';
import fs from 'fs';
import { DBLinks } from '../interfaces';

interface boardId {
  AUTO_INCREMENT: number;
}

const imgStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const [nextBoardId]: Array<boardId> = await knex('information_schema.tables').select('AUTO_INCREMENT').where({
      table_schema: CONF.db.database,
      table_name: 'links'
    });
    const path = __dirname + `/../uploads/${nextBoardId.AUTO_INCREMENT}`;
    console.log(path);
    fs.mkdirSync(path, { recursive: true });
    cb(null, `${path}/`);
  },
  filename: function (req, file, cb) { cb(null, file.originalname); }
});
const imgUpload = multer({ storage: imgStorage });  // 이미지 업로드 미들웨어 설정

const router = Router();

router
// 링크 등록할 때
.post('/link', imgUpload.single('file'), async (req: Request, res: Response) => {
  const { url, title, fileWhether, imgUrl, location, field, isDeli, isDirect } = req.body;

  const [links]: Array<DBLinks> = await knex('links').where({ url });  // 데이터베이스에 등록 된 링크 조회
  if(links) return res.status(400).json({ success: false, message: '이미 등록하시려는 링크가 존재합니다.' });

  let datas;
  if(JSON.parse(fileWhether))  // 이미지 업로드 방식이 파일 업로드일 때
    datas = {
      url,
      image: req.file?.path.substring(req.file.path.indexOf('uploads')+'uploads'.length, req.file.path.length),  // 이미지 경로를 로컬 경로로 설정
      ...(JSON.parse(isDirect) && {location, field: 'direct'}),  // 직접체험일 때 추가
      ...(JSON.parse(isDeli) && {field: 'delivery'}),  // 배송체험일 때 추가
      tag: field,
      title
    }
  else  // 이미지 업로드 방식이 링크일 때
    datas = {
      url,
      image: imgUrl,  // 이미지 주소를 url로 등록
      ...(JSON.parse(isDirect) && {location, field: 'direct'}),
      ...(JSON.parse(isDeli) && {field: 'delivery'}),
      tag: field,
      title
    }

  await knex('links').insert(datas)
  .catch(err => {
    console.log(err);
    res.status(500).json({ success: false, message: '알 수 없는 에러가 발생했습니다.' });
  });  // 데이터베이스에 링크 등록
  res.status(200).json({ success: true });
})


export default router;