import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { QueryFailedError, Repository } from 'typeorm';
import { AllPostsDto, CreatePostDto, PostDto, UpdatePostDto } from '../dtos/posts.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(input: CreatePostDto): Promise<PostDto> {
    const author = await this.usersRepo.findOne({ where: { id: input.authorId } });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const post = this.repo.create(input);
    const saved = await this.savePost(post);
    return this.toPostDto(saved);
  }

  async findAll(): Promise<AllPostsDto> {
    const posts = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return plainToInstance(
      AllPostsDto,
      { posts: posts.map((post) => this.toPostDto(post)) },
      { excludeExtraneousValues: true },
    );
  }

  async findOne(id: string): Promise<PostDto> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.toPostDto(post);
  }

  async update(id: string, input: UpdatePostDto): Promise<PostDto> {
    const post = await this.findOneEntity(id);
    const updated = this.repo.merge(post, input);
    const saved = await this.savePost(updated);
    return this.toPostDto(saved);
  }

  async remove(id: string): Promise<{ id: string }> {
    const post = await this.findOneEntity(id);
    await this.repo.remove(post);
    return { id };
  }

  private async findOneEntity(id: string): Promise<Post> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private toPostDto(post: Post): PostDto {
    return plainToInstance(PostDto, post, { excludeExtraneousValues: true });
  }

  private async savePost(post: Post): Promise<Post> {
    try {
      return await this.repo.save(post);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new NotFoundException('Author not found');
      }
      throw error;
    }
  }
}
