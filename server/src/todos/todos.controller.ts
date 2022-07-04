import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  getAll() {
    return this.todoService.getAll();
  }

  @Get(':id')
  getTodo(@Param('id') id: number) {
    return this.todoService.getTodo(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addTodo(@Body() body: AddTodoDto) {
    return this.todoService.addTodo(body);
  }

  @Delete(':id')
  removeTodo(@Param('id') id: number) {
    return 'Remove ' + id;
  }

  @Put(':id')
  updateTodo(@Body() body: UpdateTodoDto, @Param('id') id: number) {
    return (
      'Update ' + id + ` Title: ${body.title} Completed: ${body.completed}`
    );
  }
}
