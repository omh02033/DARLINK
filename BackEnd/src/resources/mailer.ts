import nodemailer from 'nodemailer';
import CONF from '../config';

const transporter = nodemailer.createTransport({  // 이메일 정보 설정
  service: CONF.email.service,
  host: CONF.email.host,
  port: CONF.email.port,
  secure: CONF.email.secure,
  auth: {
    user: CONF.email.auth.user,
    pass: CONF.email.auth.pass,
  }
});

export default transporter;