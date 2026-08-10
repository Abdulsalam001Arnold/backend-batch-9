

import { Router } from "express";
import { getHome, getAbout, postUser, loginUser, signleUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router()

router.get("/", getHome).get("/about", getAbout).post('/signup', postUser).post("/login", loginUser).get("/user/:id", authMiddleware, signleUser).delete("/delete-user/:id", authMiddleware, deleteUser)

export default router;