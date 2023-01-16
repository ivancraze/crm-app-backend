import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { JWT_SECRET } from '../config';
import { IUserResponse } from './user.model';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // проверяем, существует ли юзер в БД
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByUsername || userByEmail) {
      throw new HttpException(
        'email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findedUser = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      {
        select: ['id', 'username', 'bio', 'image', 'password'],
      },
    );

    if (!findedUser) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isMatchPassword = await compare(
      loginUserDto.password,
      findedUser.password,
    );

    if (!isMatchPassword) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete findedUser.password;

    return findedUser;
  }

  async updateUser(
    currentUserId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(currentUserId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  serializeUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
