import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AllUsersDto, CreateUserDto, UpdateUserDto, UserDto } from '../dtos/users.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(input: CreateUserDto): Promise<UserDto> {
    const user = this.repo.create(input);
    const saved = await this.repo.save(user);
    return this.toUserDto(saved);
  }

  async findAll(): Promise<AllUsersDto> {
    const users = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return plainToInstance(
      AllUsersDto,
      { users: users.map((user) => this.toUserDto(user)) },
      { excludeExtraneousValues: true },
    );
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserDto(user);
  }

  async update(id: string, input: UpdateUserDto): Promise<UserDto> {
    const user = await this.findOneEntity(id);
    const updated = this.repo.merge(user, input);
    const saved = await this.repo.save(updated);
    return this.toUserDto(saved);
  }

  async remove(id: string) {
    const user = await this.findOneEntity(id);
    await this.repo.remove(user);
    return { id };
  }

  private async findOneEntity(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private toUserDto(user: User): UserDto {
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
}
