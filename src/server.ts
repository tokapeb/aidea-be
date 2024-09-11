// const express = require('express');
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import errorHandler from './middleware/error';

const env = process.env.NODE_ENV || 'production';

console.log('env: ', env);

if (env === 'development' || env === 'local') {
  dotenv.config({ path: __dirname + '/configs/config.env' });
}

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const port = parseInt(process.env.PORT || '5001');

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).send('OK');
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running and listening to http://localhost:${port}.`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
