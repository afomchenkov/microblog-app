import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllUsersDto, CreateUserDto, UpdateUserDto, UserDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user', operationId: 'create-user' })
  create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', operationId: 'get-all-users' })
  findAll(): Promise<AllUsersDto> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id', operationId: 'get-user-by-id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', operationId: 'update-user' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', operationId: 'delete-user' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ id: string }> {
    return this.usersService.remove(id);
  }
}
