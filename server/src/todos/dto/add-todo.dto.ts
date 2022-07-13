import { IsString } from 'class-validator';

export class AddTodoDto {
  @IsString()
  readonly title: string;
}
