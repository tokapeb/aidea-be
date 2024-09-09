import { Request, Response, NextFunction, RequestHandler } from 'express';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (
  err: {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
    statusCode?: number;
  },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === 'akarmi') {
    const message = 'Hello world error.';
    error = new ErrorResponse(message, 123);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
