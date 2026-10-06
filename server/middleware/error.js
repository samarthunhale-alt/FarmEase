import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

export const notFound = (req, res, next) =>
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors;

  if (err instanceof ZodError) {
    status = 400;
    message = 'Validation failed';
    errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
  } else if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Session expired. Please log in again.';
  } else if (err.name === 'MulterError') {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2 MB or smaller' : err.message;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  }

  const prod = process.env.NODE_ENV === 'production';
  if (status >= 500) {
    console.error(err);
    if (prod) message = 'Internal server error';
  }
  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(!prod && status >= 500 && { stack: err.stack }),
  });
};
