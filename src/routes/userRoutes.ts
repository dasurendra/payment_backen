import { Router } from "express";
import { UserController } from "../controllers/userController";

// Initialize the router and user controller
const router = Router();
const userController = new UserController();

// Define the registration route
router.post("/signup", (req, res) => userController.register(req, res));
// Define the login route
router.post("/login", (req, res) => userController.login(req, res));

export default router;
