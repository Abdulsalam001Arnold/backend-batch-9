

import { Router } from "express";
import { getHome, getAbout, postUser, loginUser } from "../controllers/userController.js";

const router = Router()

router.get("/", getHome).get("/about", getAbout).post('/signup', postUser).post("/login", loginUser)

export default router;