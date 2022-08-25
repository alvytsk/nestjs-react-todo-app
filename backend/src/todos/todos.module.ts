import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
})
export class TodosModule {}
