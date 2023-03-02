const express = require("express");
const app = require("./app");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const port = 3000;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// Setup cloudwatch for production logs. If in dev env then logs will 
// continue to go to console. Production will go to cloudwatch
const winston = require('winston'),
      WinstonCloudWatch = require('winston-cloudwatch');

const logger = new winston.createLogger({
    format: winston.format.json(),
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true,
        })
   ]
});
if (process.env.NODE_ENV === 'production') {
const cloudwatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: process.env.NODE_ENV,
    awsAccessKeyId: process.env.CLOUDWATCH_ACCESS_KEY,
    awsSecretKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    awsRegion: process.env.CLOUDWATCH_REGION,
    messageFormatter: ({ level, message, additionalInfo }) =>    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`
}
    logger.add(new WinstonCloudWatch(cloudwatchConfig))
}

// Application start
app.listen(port, () => {
    console.log(`Klear-backend listening on port ${port}`);
});

module.exports = logger;
