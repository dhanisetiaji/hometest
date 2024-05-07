import { Prisma } from '@prisma/client';
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = HttpStatus.BAD_REQUEST;
    const message = exception.meta.cause;
    const error = 'Prisma Error';

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
