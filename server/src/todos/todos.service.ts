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
    return await this.todoModel.find().exec();
  }

  async getTodo(id: number): Promise<Todo> {
    return await this.todoModel.findById(id);
  }

  async addTodo(todoDto: AddTodoDto) {
    const newTodo = new this.todoModel({
      ...todoDto,
      completed: false,
    });
    return await newTodo.save();
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
