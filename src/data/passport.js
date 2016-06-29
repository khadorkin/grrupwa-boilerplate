import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from './models/User';
import { auth } from '../config';

passport.use(new FacebookStrategy({
  clientID: auth.facebook.id,
  clientSecret: auth.facebook.secret,
  callbackURL: '/login/facebook/return',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

export default passport;
