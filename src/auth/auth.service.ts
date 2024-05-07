import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export type AuthUser = {
  id: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where });
  }

  async login(email: string, password: string) {
    const user = await this.findUser({
      email,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('invalid password');
    }

    return this.prepareToken(user);
  }

  async getAuthUser(id: string) {
    return this.findUser({ id });
  }

  async prepareToken(user) {
    const payload: AuthUser = {
      id: user.id,
      email: user.email,
    };

    const expiresIn = '360d';

    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
