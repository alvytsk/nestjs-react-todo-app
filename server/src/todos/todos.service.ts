import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  private todos = [];

  async getAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async getTodo(id: number): Promise<Todo> {
    return this.todoModel.findById(id);
  }

  addTodo(todoDto: AddTodoDto) {
    const id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 0;

    this.todos.push({
      ...todoDto,
      completed: false,
      id: id,
    });
  }

  removeTodo(id: number) {
    const index = this.todos.findIndex((item) => item.id === id);
    this.todos.splice(index, 1);
  }

  updateTodo(id: number, body: UpdateTodoDto) {
    const index = this.todos.findIndex((item) => item.id === id);

    this.todos[index] = {
      ...body,
    };
  }
}
