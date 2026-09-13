import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findSafeById(id);
  }

  @Patch(':id/access')
  updateAccess(@Param('id') id: string, @Body() body: { role?: string; status?: string }) {
    return this.usersService.updateAccess(id, body);
  }
}
