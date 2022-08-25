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
  Res,
} from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  async getAll(@Res() res) {
    const todos = await this.todoService.getAll();
    return res.status(HttpStatus.OK).json({
      status: 200,
      data: todos,
    });
  }

  @Get(':id')
  getTodo(@Param('id') id: number) {
    return this.todoService.getTodo(id);
  }

  @Post()
  async addTodo(@Res() res, @Body() body: AddTodoDto) {
    const todo = await this.todoService.addTodo(body);
    return res.status(HttpStatus.CREATED).json({
      status: 201,
      data: todo,
    });
  }

  @Delete(':id')
  removeTodo(@Param('id') id: number) {
    return this.todoService.removeTodo(id);
  }

  @Put(':id')
  updateTodo(@Body() body: UpdateTodoDto, @Param('id') id: number) {
    return this.todoService.updateTodo(id, body);
  }
}
