import * as winston from 'winston';

const logFileLevel = 'debug';

const alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    (info) =>
      ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  )
);

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  level: logFileLevel,
  format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
});
