import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, NewUserDto } from 'src/user/dto';
import { UserDetails } from 'src/user/user.interface';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  async register(dto: Readonly<NewUserDto>): Promise<UserDetails | null> {
    const { email, name, password } = dto;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ForbiddenException('Credentials taken');
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<UserDetails> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }
    const isPwdCorrect = await this.doesPasswordMatch(password, user.password);
    if (!isPwdCorrect) {
      throw new ForbiddenException('Invalid Credentials');
    }

    return this.userService._getUserDetails(user);
  }

  async login(dto: LoginDto): Promise<{ token: string } | null> {
    const { email, password } = dto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const token = await this.jwtService.signAsync({
      user,
    });
    return { token };
  }
}
