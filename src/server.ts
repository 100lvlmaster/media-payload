import express from 'express';
import { readFileSync } from 'fs';
import payload from 'payload';
import { config as dotenv } from 'dotenv';
import path from 'path';
import fs from 'fs';
require('dotenv').config();

dotenv({
  path: path.resolve(__dirname, '../.env'),
});
// Redirect root to Admin panel
const dev = process.env.NODE_ENV !== 'production';
const app = express();
app.use('/public', express.static(path.resolve(__dirname, '../public')));

app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,

  // Only needed to deploy publicly. Get free Personal license at https://payloadcms.com.
  // license: process.env.PAYLOAD_LICENSE_KEY,

  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here

app.listen(3333);
