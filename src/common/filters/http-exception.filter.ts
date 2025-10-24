import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        error = exceptionResponse;
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        error = responseObj.error || responseObj.message || exception.message;
        message = Array.isArray(responseObj.message) 
          ? responseObj.message.join(', ') 
          : responseObj.message || exception.message;
      }
    } else if (exception instanceof Error) {
      error = exception.message;
      message = exception.message;
    }

    response.status(status).json({
      message: message,
      data: null,
      error: error,
    });
  }
}

