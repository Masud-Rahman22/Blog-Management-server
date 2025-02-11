import express from "express";
import auth from "../../middlewares/auth";
import { postController } from "./post.controller";


const router = express.Router();

router.get("/", auth("admin"), postController.getPosts);
router.post("/", auth("user"), postController.createPost);
router.put("/:id", auth("user", "admin"), postController.updatePost);
router.delete("/:id", auth("user", "admin"), postController.deletePost);

export const PostRoutes = router;
