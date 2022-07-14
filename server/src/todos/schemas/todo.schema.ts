import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  @ApiProperty({ example: 'New todo', description: 'Todo text' })
  title?: string;

  @Prop()
  @ApiProperty({ example: true, description: 'Todo status' })
  completed?: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
