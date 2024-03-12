/* eslint-disable no-undef */
require('dotenv').config();
module.exports = {
  database: {
    URL: 'mongodb://127.0.0.1:27017/kota',
  },

  jwt: {
    secret: 'wofenwonewoinewoioewnoewiew',
  },

  redis: {
    URL: '127.0.0.1:6379',
  },

  email: {
    domain: process.env.ZEPTOMAIL_DOMAIN,
    apiKey: process.env.ZEPTOMAIL_API_KEY,
  },

  ethereal: {
    host: 'smtp.ethereal.email',
    port: '587',
    secure: 'STARTTLS',
    user: 'manley.barton17@ethereal.email',
    pass: 'EqeA3hWykPtDVvJ54z',
  },

  client: {
    url: 'http://localhost:5173/verify/',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
