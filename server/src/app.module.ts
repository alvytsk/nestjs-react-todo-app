import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TodosModule,
    MongooseModule.forRoot('mongodb://todos:todos@todos-mongodb:27017/todos'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
