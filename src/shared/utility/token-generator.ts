/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';
/* import config from 'config'; */
import { envs } from 'config/env';

export const generateAuthToken = (id: string) => {
  return jwt.sign({ id }, envs.wordSecret, {
    expiresIn: '30d',
  });
};

export const decodeAuthToken = (token: string) => {
  return jwt.verify(token, envs.wordSecret);
};