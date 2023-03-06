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

// Application start
app.listen(port, () => {
    console.log(`Klear-backend listening on port ${port}`);
});