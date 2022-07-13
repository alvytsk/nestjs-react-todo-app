import { IsString, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly completed: boolean;
}
