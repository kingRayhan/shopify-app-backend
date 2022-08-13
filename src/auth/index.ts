import { Router } from "express";
import login from "./login";
import callback from "./callback";
const router = Router();

router.get("/login", login);
router.get("/callback", callback);

export default router;
