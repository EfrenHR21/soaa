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

  APP_PREFIX: string;

  FORGOT_PASSWORD: string;
  VERIFY_EMAIL: string;
  ORDER_SOURCES: string;

  CLOUDINARY_URL: string;
  CLOUD_NAME: 'string';
  API_KEY: 'string';
  API_SECRET: 'string';
  FOLDER_PATH: 'string';
  PUBLICID_PREFIX: 'string';
  BIG_SIZE: 'string';

  PUBLISHABLE_KEY: string;
  SECRET_KEY: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
  WEBHOOK_SECRET: string;
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
    APP_PREFIX: joi.string().required(),
    FORGOT_PASSWORD: joi.string().required(),
    VERIFY_EMAIL: joi.string().required(),
    ORDER_SOURCES: joi.string().required(),
    CLOUDINARY_URL: joi.string().required(),
    CLOUD_NAME: joi.string().required(),
    API_KEY: joi.string().required(),
    API_SECRET: joi.string().required(),
    FOLDER_PATH: joi.string().required(),
    PUBLICID_PREFIX: joi.string().required(),
    BIG_SIZE: joi.string().required(),
    PUBLISHABLE_KEY: joi.string().required(),
    SECRET_KEY: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
    WEBHOOK_SECRET: joi.string().required(),
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
  appPrefix: envVars.APP_PREFIX,
  forgotPassword: envVars.FORGOT_PASSWORD,
  verifyEmail: envVars.VERIFY_EMAIL,
  orderSuccess: envVars.ORDER_SOURCES,
  cloudinaryUrl: envVars.CLOUDINARY_URL,
  cloudName: envVars.CLOUD_NAME,
  apiKey: envVars.API_KEY,
  apiSecret: envVars.API_SECRET,
  folderPath: envVars.FOLDER_PATH,
  publicIdPrefix: envVars.PUBLICID_PREFIX,
  bigSize: envVars.BIG_SIZE,
  publishableKey: envVars.PUBLISHABLE_KEY,
  secretKey: envVars.SECRET_KEY,
  successUrl: envVars.SUCCESS_URL,
  cancelUrl: envVars.CANCEL_URL,
  webhookSecret: envVars.WEBHOOK_SECRET,
};
