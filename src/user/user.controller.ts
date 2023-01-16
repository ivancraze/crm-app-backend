import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './user.model';
import { LoginUserDto } from './dto/loginUser.dto';
import { IRequestExpress } from '../types/expressRequest.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.serializeUserResponse(user);
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.serializeUserResponse(user);
  }

  @Get('user')
  async getCurrentUser(
    @Req() request: IRequestExpress,
  ): Promise<IUserResponse> {
    return this.userService.serializeUserResponse(request.user);
  }
}
