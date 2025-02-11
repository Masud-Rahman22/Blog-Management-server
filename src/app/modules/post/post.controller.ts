import { Request, Response } from "express";
import { postService } from "./post.service";
import { postSchema, updatePostSchema } from "./post.validation";

const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === "admin";
    const userId = req.user?.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await postService.getPosts(userId, isAdmin, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the body using zod
    const validation = postSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json(validation.error.errors); // Validation failed
      return; // Ensure the function returns after sending the response
    }

    // Check if req.user exists and has an id
    if (!req.user || !req.user.id) {
      res.status(400).json({ message: "User ID is required" }); // Missing user ID
      return; // Ensure the function returns after sending the response
    }

    // Attempt to create the post
    const newPost = await postService.createPost({ ...req.body, authorId: req.user.id });

    // If post creation succeeds, send the new post
    res.status(201).json(newPost);
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating post:", error);

    // Send a more detailed error message (optional)
    res.status(500).json({ message: "Error creating post", error: error instanceof Error ? error.message : error });
  }
};
const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = updatePostSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json(validation.error.errors);
      return;
    }

    const post = await postService.getPostById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.authorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const updatedPost = await postService.updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.authorId.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await postService.deletePost(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

export const postController = {
  getPosts,
  createPost,
  updatePost,
  deletePost
};
