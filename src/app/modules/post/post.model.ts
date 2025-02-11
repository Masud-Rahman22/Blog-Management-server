import { Schema, Types, model, Document } from "mongoose";
import { IPost } from "./post.interface";

// Ensure IPostDocument extends both IPost and Document
interface IPostDocument extends Document, IPost {
  authorId: Types.ObjectId;
}

const postSchema = new Schema<IPostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Fix here
  },
  { timestamps: true }
);

export const Post = model<IPostDocument>("Post", postSchema);
