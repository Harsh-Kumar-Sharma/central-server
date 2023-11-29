const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MSSQL_HOST: Joi.string().required().description('MSSQL Host'),
    MSSQL_USER: Joi.string().required().description('MSSQL USER'),
    MSSQL_PASSWORD: Joi.string().required().description('MSSQL Pass'),
    MSSQL_DATABASE: Joi.string().required().description('MSSQL DB'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    MEDIA_UPLOAD_PATH: Joi.string().description('Media upload path'),

  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  port: envVars.PORT,
  mssql: {
    host: envVars.MSSQL_HOST,
    user: envVars.MSSQL_USER,
    password: envVars.MSSQL_PASSWORD,
    database: envVars.MSSQL_DATABASE,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    accountActivationLinkExpirationMinutes: 518400,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: envVars.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
      },
    },
    from: envVars.EMAIL_FROM,
  },
  uploadPath: envVars.MEDIA_UPLOAD_PATH,
 
};
