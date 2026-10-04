const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Define the custom format for logging
const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
    level: 'info', // Minimum level to log
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        // 1. Log errors and below to a file 'error.log'
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        
        // 2. Log everything ('info' and below) to 'combined.log'
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

// If we are not in production, also log to the console with colors
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(), // Adds color to the console output
            myFormat
        )
    }));
}

module.exports = logger;
