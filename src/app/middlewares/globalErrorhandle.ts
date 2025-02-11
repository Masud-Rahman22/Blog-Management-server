/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import { TErrorSources } from '../interface/error'
import handleZodError from '../error/handleZodError'
import handleValidationError from '../error/handleValidationError'
import { handleCastError } from '../error/handleCastError'
import handleDuplicateError from '../error/handleDuplicateError'
import { AppError } from '../error/appError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Set default values
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessages: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorSources
  } else if (err.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorSources
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorSources
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorSources
  } else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err.message
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ]
  }

  // Return formatted error response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env === 'development' ? err.stack : undefined,
  })
}

export default globalErrorHandler