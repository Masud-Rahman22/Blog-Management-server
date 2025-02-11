import { Types } from "mongoose";

export interface IPost {
    title: string;
    content: string;
    authorId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }