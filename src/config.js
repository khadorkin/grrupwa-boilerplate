/* eslint-disable max-len */

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.WEBSITE_HOSTNAME || `http://localhost:${PORT}`;

export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/grrupwa';

export const analytics = {

  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'GOOGLE_TRACKING_ID' },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'JWT_SECRET' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || 'FACEBOOK_APP_ID',
    secret: process.env.FACEBOOK_APP_SECRET || 'FACEBOOK_APP_SECRET',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET',
  },

};
