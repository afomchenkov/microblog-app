import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AllPostsDto,
  CreatePostDto,
  GetPostsQueryDto,
  PostDto,
  UpdatePostDto,
} from '../dtos/posts.dto';
import { PostsService } from '../services/posts.service';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create post', operationId: 'create-post' })
  async create(@Body() body: CreatePostDto): Promise<PostDto> {
    return this.postsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts', operationId: 'get-all-posts' })
  async findAll(@Query() query: GetPostsQueryDto): Promise<AllPostsDto> {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id', operationId: 'get-post-by-id' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<PostDto> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post', operationId: 'update-post' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePostDto,
  ): Promise<PostDto> {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post', operationId: 'delete-post' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ id: string }> {
    return this.postsService.remove(id);
  }
}
