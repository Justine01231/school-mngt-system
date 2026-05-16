import { pino, type Logger } from 'pino';
import { config } from '../../config/env.js';

const isProd = config.env === 'production';

// Redact known-sensitive paths. Repositories/handlers should still avoid
// logging full payloads of user input — this is defense in depth, not a license
// to log raw bodies.
const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'res.headers["set-cookie"]',
  'req.body.password',
  'req.body.passwordHash',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.accessToken',
  '*.password',
  '*.passwordHash',
  '*.token',
  '*.refreshToken',
  '*.accessToken',
];

export const logger: Logger = pino({
  level: config.log.level,
  base: { pid: process.pid, env: config.env },
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isProd
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss.l',
            ignore: 'pid,env,hostname',
            singleLine: false,
          },
        },
      }),
});