import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';
import { getMongoConfig } from './db-connect.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Позволяет обратиться к env во всем приложении
      envFilePath: './backend.env', // Указываем путь до env файла
    }),
    TodosModule,
    MongooseModule.forRootAsync({
      // Модуль для работы с mongo
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig, // добавляем созданную ранее функцию подключения к БД
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
