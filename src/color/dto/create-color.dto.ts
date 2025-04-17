import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
    @ApiProperty({ example: 'Qora', description: 'rang nomi' })
    @IsString()
    name: string;}