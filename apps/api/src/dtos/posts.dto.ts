import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePostDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content!: string;

  @Transform(trimString)
  @IsUUID()
  authorId!: string;
}

export class UpdatePostDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content?: string;
}

export class PostDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  authorId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export class AllPostsDto {
  @Expose()
  @Type(() => PostDto)
  @ValidateNested({ each: true })
  posts!: PostDto[];
}

export class GetPostsQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  numberPerPage?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
