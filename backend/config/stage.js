/* eslint-disable no-undef */
require('dotenv').config();
module.exports = {
  database: {
    URL: process.env.DB_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  redis: {
    URL: process.env.REDISCLOUD_URL,
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
    url: process.env.CLIENT_URL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
