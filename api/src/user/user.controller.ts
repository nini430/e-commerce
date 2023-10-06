import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDetails } from './user.interface';
import { JwtGuard } from 'src/auth/guards';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }
}
