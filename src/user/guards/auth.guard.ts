import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { IRequestExpress } from '../../types/expressRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequestExpress>();

    if (request.user) return true;

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
