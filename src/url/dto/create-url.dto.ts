import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/some-long-url' })
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({ example: 'my-link' })
  @IsOptional()
  @IsString()
  customAlias?: string;
}
