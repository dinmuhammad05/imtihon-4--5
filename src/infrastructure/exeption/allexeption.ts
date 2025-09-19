import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    console.log(exception);
    
    if (status === 500) {
      console.log(`Danggg: ${exception}`);
    }
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const message = (exceptionResponse as any).message;
        if (Array.isArray(message)) {
          errorMessage = message.join(', ');
        } else {
          errorMessage = message || errorMessage;
        }
      }
    }
    const errorResponse = {
      statusCode: status,
      error: {
        message: errorMessage,
      },
    };
    res.status(status).json(errorResponse);
  }
}