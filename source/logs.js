const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss'
        }),
        winston.format.printf(({timestamp, level, message}) => {
            return `${level} ${timestamp}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/info.log'
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log'
        }),
        new winston.transports.Console({
            level: 'info'
        })
    ]
});

module.exports = {logger};