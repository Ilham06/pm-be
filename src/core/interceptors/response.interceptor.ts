// response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException, HttpException, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        status: true,
        message: 'Success',
        data,
      })),
      catchError((err) => {
        console.log(err)
        const res = {
          code: 400,
          status: false,
          message: err.message,
          data: null
        };

        if (err instanceof BadGatewayException) {
          res.code = 502;
          res.message = 'Bad Gateway';
        } else if (err instanceof BadRequestException) {
          if (err.getResponse() && err.getResponse()['message']) {
            // Extract detailed validation error messages
            res.message = err.getResponse()['message']
          }
        }
        
        throw new HttpException(res, res.code);
      }),
    );
  }
}
