import { Request, Response } from "express";
import { signupUser, loginUser } from "../services/dynamodbService";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await signupUser(email, password);
    res.json({ message: "User signed up successfully", result });
  } catch (error: unknown) {
    console.error("Signup Error:", (error as Error).message);
    if ((error as any).name === "ConditionalCheckFailedException") {
      res.status(409).json({ message: "User already exists" });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.json({ message: "User logged in successfully", result });
  } catch (error: unknown) {
    console.error("Login Error:", (error as Error).message);
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
