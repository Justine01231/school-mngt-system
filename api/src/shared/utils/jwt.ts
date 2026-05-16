import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config/env.js';

export const generateAccessToken = (payload: any): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessTtl,
  } as SignOptions);
};

export const generateRefreshToken = (payload: any): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshTtl,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, config.jwt.accessSecret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.jwt.refreshSecret);
};
