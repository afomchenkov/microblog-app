import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AllPostsDto, CreatePostDto, PostDto, UpdatePostDto } from '../dtos/posts.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}

  async create(input: CreatePostDto): Promise<PostDto> {
    const post = this.repo.create(input);
    const saved = await this.repo.save(post);
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
    const saved = await this.repo.save(updated);
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
}
