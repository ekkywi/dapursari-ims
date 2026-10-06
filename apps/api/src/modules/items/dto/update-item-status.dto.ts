import { IsBoolean } from 'class-validator';

export class UpdateItemStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
