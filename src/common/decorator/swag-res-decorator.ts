import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwagSuccessRes(
  summary: string,
  status: number = HttpStatus.OK,
  description: string = 'Successful response',
  statusCode: number = status,
  message: string = 'en:success,uz:muvaffaqiyatli',
  data: object = {},
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          statusCode,
          message,
          data,
        },
      },
    }),
  );
}

export function SwagFailedRes(
  status: number = HttpStatus.BAD_REQUEST,
  description: string = 'Failed response',
  statusCode: number = HttpStatus.BAD_REQUEST,
  errorMessage: string = 'en: Some error occurred, uz: Xatolik yuz berdi',
) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          statusCode,
          error: {
            message: errorMessage,
          },
        },
      },
    }),
  );
}