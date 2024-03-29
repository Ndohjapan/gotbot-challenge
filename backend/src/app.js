const express = require('express');
const hpp = require('hpp');
const helmet = require('helmet');
const cors = require('cors');
const { interceptorParam } = require('./middlewares/logger');
const errorHandler = require('./errors/error-handler');
const en = require('../locale/en');
const NotFundException = require('./errors/not-found-exception');
const { auth, category, item, file, menu, business } = require('./routes');
const { securityResponseHeader } = require('./middlewares/res-secure-header');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(securityResponseHeader);

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'test') {
  app.use(interceptorParam);
}

const baseRoute = '/api/1.0';
app.use(baseRoute + '/auth', auth);
app.use(baseRoute + '/menu', menu);
app.use(baseRoute + '/category', category);
app.use(baseRoute + '/item', item);
app.use(baseRoute + '/file', file);
app.use(baseRoute + '/profile', business);

app.get(baseRoute + '/health', (req, res) => {
  res.send({ health: 'Ok' });
});

app.use((req, res, next) => {
  next(new NotFundException(en['page-not-found']));
});

app.use(errorHandler);

module.exports = { app };
