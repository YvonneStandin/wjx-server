import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatDocument = HydratedDocument<Stat>;

@Schema()
export class Stat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const StatSchema = SchemaFactory.createForClass(Stat);
