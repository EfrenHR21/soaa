import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: string;
  ADMIN_TOKEN_SECRET: string;
  MONGODB_URL: string;
  SECRET_WORD: string;
  DIRECTION_MAILGUN: string;
  LOGIN_LINK: string;
  TEST_DOMAIN_SANDBOX: string;
  API_KEY_PIVATE: string;
  API_KEY_PUBLIC: string;

  FORGOT_PASSWORD: string;
  VERIFY_EMAIL: string;
  ORDER_SOURCES: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    ADMIN_TOKEN_SECRET: joi.string().required(),
    MONGODB_URL: joi.string().required(),
    SECRET_WORD: joi.string().required(),
    DIRECTION_MAILGUN: joi.string().required(),
    LOGIN_LINK: joi.string().required(),
    TEST_DOMAIN_SANDBOX: joi.string().required(),
    API_KEY_PIVATE: joi.string().required(),
    API_KEY_PUBLIC: joi.string().required(),
    FORGOT_PASSWORD: joi.string().required(),
    VERIFY_EMAIL: joi.string().required(),
    ORDER_SOURCES: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongodbUrl: envVars.MONGODB_URL,
  adminSecretToken: envVars.ADMIN_TOKEN_SECRET,
  wordSecret: envVars.SECRET_WORD,
  directionMailgun: envVars.DIRECTION_MAILGUN,
  loginLink: envVars.LOGIN_LINK,
  testDomain: envVars.TEST_DOMAIN_SANDBOX,
  privateApiKey: envVars.API_KEY_PIVATE,
  publicApiKey: envVars.API_KEY_PUBLIC,
  forgotPassword: envVars.FORGOT_PASSWORD,
  verifyEmail: envVars.VERIFY_EMAIL,
  orderSuccess: envVars.ORDER_SOURCES,
};
