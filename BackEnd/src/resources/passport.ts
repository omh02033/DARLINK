import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import CONF from '../config';

export default passport.use(new KakaoStrategy({
  clientID: CONF.passport.clientId,
  clientSecret: CONF.passport.secretId,
  callbackURL: CONF.backBaseURL+'/auth/kakao/oauth'
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  done(null, profile);
}));