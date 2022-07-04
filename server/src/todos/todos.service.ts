import { Injectable } from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';

@Injectable()
export class TodosService {
  private todos = [];

  getAll() {
    return this.todos;
  }

  getTodo(id: number) {
    return this.todos.find((item) => item.id === id);
  }

  addTodo(todoDto: AddTodoDto) {
    const id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 0;

    this.todos.push({
      ...todoDto,
      id: id,
    });
  }
}
