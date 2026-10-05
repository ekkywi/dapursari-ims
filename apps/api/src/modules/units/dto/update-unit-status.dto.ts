import { IsBoolean } from 'class-validator';

export class UpdateUnitStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
