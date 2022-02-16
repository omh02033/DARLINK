import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import CONF from '../config';

export default passport.use(new KakaoStrategy({
    clientID: (process.env.K_PASSWORD_CLIENT_ID)!,
    clientSecret: (process.env.K_PASSPORT_CLIENT_SECRET)!,
    callbackURL: CONF.backBaseURL+'/auth/kakao/oauth'
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    done(null, profile);
}));