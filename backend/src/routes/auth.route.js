import { Router } from "express";

import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  signup_post,
  login_post,
  logout_post,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup_post);
router.post("/login", login_post);
router.post("/logout", logout_post);

router.put("/update-profile", authenticateJWT, updateProfile);

router.get("/check", authenticateJWT, checkAuth);
export default router;
