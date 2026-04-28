import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/some-long-url' })
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({ example: 'my-link' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'customAlias can only contain letters, numbers, hyphens, and underscores',
  })
  customAlias?: string;
}
