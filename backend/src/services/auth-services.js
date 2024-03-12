const config = require('config');
const jwtConfig = config.get('jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const BusinessRepository = require('../database/repositories/business-repository');
const createException = require('../errors/create-exception');
const emailException = require('../errors/email-exception');
const { sendEmail } = require('../utils/ethereal-email');
const { sendEmail: prodSendEmail } = require('../utils/postmark-email');
const en = require('../../locale/en');
const notFoundException = require('../errors/not-found-exception');
const valueExpirationException = require('../errors/value-expiration-exception');
const internalException = require('../errors/internal-exception');
const authException = require('../errors/auth-exception');
const updateException = require('../errors/update-exception');
const ContactRepository = require('../database/repositories/contact-repository');
const secretKey = jwtConfig.secret;

const secretCode = crypto.randomBytes(32);

const iv = crypto.randomBytes(16);


class AuthService {
  constructor() {
    this.repository = new BusinessRepository();
    this.contactRepository = new ContactRepository();
  }
  
  async generateMagicToken(email, expiresIn) {
    const token = await jwt.sign({ email, expiresIn }, secretKey, {
      expiresIn: 1800,
    });

    const cipher = crypto.createCipheriv('aes-256-cbc', secretCode, iv);

    let encrypted = cipher.update(token, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const urlSafeEncrypted = encrypted
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return urlSafeEncrypted;
  }

  getFutureMinutes(minutes) {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + minutes * 60000);
  }

  async hashString(string) {
    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(string, salt);
    return hashedString;
  }

  async compareString(string, hashedString) {
    const match = await bcrypt.compare(string, hashedString);
    return match;
  }

  async decodeToken(token) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretCode, iv);

    let decrypted = decipher.update(token, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    const decoded = jwt.verify(decrypted, jwtConfig.secret);
    return decoded;
  }

  compareTimeStamp(timestamp1, timestamp2) {
    return timestamp1 > timestamp2;
  }

  async FindBusinessByEmail(email) {
    try {
      const business = await this.repository.FindByEmail(email);
      if (!business) {
        throw new Error(en['business-not-found']);
      }
      return business;
    } catch (error) {
      throw new notFoundException(error.message);
    }
  }

  async Signup(businessData) {
    let { name, email, password } = businessData;

    password = await this.hashString(password);

    const expiryTime = this.getFutureMinutes(15);
    const magicToken = await this.generateMagicToken(email, expiryTime);

    try {
      const businessNameExist = await this.repository.FindByName(name);

      if (businessNameExist) {
        throw new Error(en['business-name-unique']);
      }

      const emailExist = await this.repository.FindByEmail(email);

      if (emailExist) {
        throw new Error(en['email-unique']);
      }

      await this.repository.CreateBusiness({
        ...businessData,
        password,
        expiryTime,
      });

      try {
        if (process.env.NODE_ENV === 'dev') {
          await sendEmail(email, magicToken);
          return {
            message: en['email-sent-successful'],
            magicToken,
          };
        } else {
          await prodSendEmail(email, magicToken);
          return {
            message: en['email-sent-successful'],
          };
        }
      } catch (error) {
        throw new emailException();
      }
    } catch (error) {
      throw new createException(error.message);
    }
  }

  async VerifyToken(token) {
    try {
      const decodedToken = await this.decodeToken(token);

      const timeExpired = this.compareTimeStamp(
        new Date(),
        decodedToken.expiresIn,
      );

      if (timeExpired) {
        throw new Error(en['verify-token-expired']);
      }

      const accountExists = await this.repository.FindByEmail(
        decodedToken.email,
      );

      if (!accountExists || accountExists.verified != false) {
        throw new Error(en['verify-token-invalid']);
      }

      const updateData = { verified: true, timeExpired: '' };

      await this.repository.UpdateBusiness(accountExists._id, updateData);

      return true;
    } catch (error) {
      throw new valueExpirationException(error.message);
    }
  }

  async RequestToken(business) {
    try {
      const { email } = business;

      const expiryTime = this.getFutureMinutes(15);

      const token = await this.generateMagicToken(email, expiryTime);

      try {
        if (process.env.NODE_ENV === 'dev') {
          await sendEmail(email, token);
        } else {
          await prodSendEmail(email, token);
        }

        return { message: en['email-sent-successful'] };
      } catch (error) {
        throw new emailException();
      }
    } catch (error) {
      throw new internalException(
        error.message || en['verify-token-generate-failure'],
      );
    }
  }

  async Login(email, password) {
    try {
      // Does the business exist
      const businessExist = await this.repository.FindByEmail(email);
      if (!businessExist) {
        throw new Error(en['login-failure']);
      }

      //   Does the password match
      const passwordCheck = await this.compareString(
        password,
        businessExist.password,
      );

      if (!passwordCheck) {
        throw new Error(en['login-failure']);
      }

      //   Is the account verified
      if (!businessExist.verified) {
        await this.RequestToken({ email });
        throw new Error(en['business-not-verified']);
      }

      const token = jwt.sign({ email }, secretKey, {
        expiresIn: '7d',
      });

      //   Removed unwated fields

      businessExist.password = undefined;
      businessExist.code = undefined;
      businessExist.expiryTime = undefined;
      businessExist.verified = undefined;

      return {
        message: en['login-success'],
        data: businessExist,
        accessToken: token,
      };
    } catch (error) {
      throw new authException(error.message);
    }
  }

  async CompleteProfile(id, updateData) {
    let { contactName, contactNumber, contactRole } = updateData;

    try {
      const businessExist = await this.repository.FindById(id);

      if (!businessExist) {
        throw new Error(en['business-not-found']);
      }

      const contact = await this.contactRepository.CreateContact({
        name: contactName,
        number: contactNumber,
        role: contactRole,
        business: businessExist._id,
      });

      updateData.profileComplete = true;

      const update = await this.repository.UpdateBusiness(id, updateData);

      return { business: update, contact };
    } catch (error) {
      throw new updateException(error.message);
    }
  }
}

module.exports = { AuthService };
