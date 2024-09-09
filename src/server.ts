// const express = require('express');
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import errorHandler from './middleware/error';

dotenv.config({ path: __dirname + '/configs/config.env' });

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5001;

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello world.' });
});

const server = app.listen(port, () => {
  console.log(
    `Server is running and listening to http://localhost:${port} buddy.`
  );
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
