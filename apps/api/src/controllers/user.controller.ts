import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllUsersDto, CreateUserDto, UpdateUserDto, UserDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user', operationId: 'create-user' })
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', operationId: 'get-all-users' })
  async findAll(): Promise<AllUsersDto> {
    return this.usersService.findAll();
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username', operationId: 'get-user-by-username' })
  async findOneByUsername(@Param('username') username: string): Promise<UserDto> {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id', operationId: 'get-user-by-id' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', operationId: 'update-user' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', operationId: 'delete-user' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ id: string }> {
    return this.usersService.remove(id);
  }
}
