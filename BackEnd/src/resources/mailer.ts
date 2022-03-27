import nodemailer from 'nodemailer';
import CONF from '../config';

const transporter = nodemailer.createTransport({  // 이메일 정보 설정
  service: CONF.email.service,  // 네이버인지 gmail 인지 등등 서비스 명
  host: CONF.email.host, 
  port: CONF.email.port,  // 이메일 포트
  secure: CONF.email.secure,
  auth: {
    user: CONF.email.auth.user,  // 이메일 아이디
    pass: CONF.email.auth.pass,  // 이메일 비밀번호
  }
});

export default transporter;