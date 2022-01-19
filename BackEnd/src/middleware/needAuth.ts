import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { tokenInterface } from '../interfaces';
import CONF from '../config';

// eslint-disable-next-line no-undef
export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || undefined;
  if (!token) return res.send(false);
  jwt.verify(token, CONF.jwt.key as string, (err: VerifyErrors | null, decoded: string | JwtPayload | tokenInterface | undefined) => {
    if (!err) {
      req.auth = decoded as tokenInterface;
      next();
    } else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.send(false);
    } else {
      return res.send(false);
    }
  });
}