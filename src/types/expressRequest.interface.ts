import { Request } from 'express';
import { UserEntity } from '../user/user.entity';

export interface IRequestExpress extends Request {
  user?: UserEntity;
}
