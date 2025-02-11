import { Post } from "./post.model";


 const getPosts = async (userId: string, isAdmin: boolean, page: number, limit: number) => {
  const filter = isAdmin ? {} : { authorId: userId };
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  const total = await Post.countDocuments(filter);
  return { posts, total, page, limit };
};

 const getPostById = async (postId: string) => {
  return await Post.findById(postId);
};

 const createPost = async (data: { title: string; content: string; authorId: string }) => {
  return await Post.create(data);
};

 const updatePost = async (postId: string, data: Partial<{ title: string; content: string }>) => {
  return await Post.findByIdAndUpdate(postId, data, { new: true });
};

 const deletePost = async (postId: string) => {
  return await Post.findByIdAndDelete(postId);
};

export const postService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
}