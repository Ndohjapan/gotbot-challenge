const en = require('../../locale/en');
const AuthException = require('../errors/auth-exception');
const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');
const { AuthService } = require('../services/auth-services');
const auth = new AuthService();

const tempAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-temp-token'];
    console.log(token);
    const decoded = await jwt.verify(token, jwtConfig.secret);

    let result = await auth.FindBusinessByEmail(decoded.email);

    if (result && !result.verified) {
      req.user = result;
      return next();
    }

    return next(new AuthException(en['authentication-failure']));
  } catch (error) {
    return next(new AuthException(en['authentication-failure']));
  }
};

const businessAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, jwtConfig.secret);

    let result = await auth.FindBusinessByEmail(decoded.email);

    if (result && result.verified && !result.code) {
      req.user = result;
      return next();
    }

    return next(new AuthException(en['authentication-failure']));
  } catch (error) {
    return next(new AuthException(en['authentication-failure']));
  }
};

module.exports = { tempAuth, businessAuth };
