import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IRequestExpress } from '../../types/expressRequest.interface';
import { JWT_SECRET } from '../../config';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IRequestExpress, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET);
      req.user = await this.userService.findUserById(decode.id);
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
