import cors from "cors";
import express, { json } from "express";
import { PrismaClient } from "@prisma/client";
import { toToken } from "./auth/jwt";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";

const app = express();
const port = 3001;
app.use(cors());
app.use(json());

const prisma = new PrismaClient();

//POST/login
app.post("/login", async (req, res) => {
  const requestBody = req.body;
  if ("username" in requestBody && "password" in requestBody) {
    try {
      const userToLogin = await prisma.user.findUnique({
        where: {
          username: requestBody.username,
        },
      });
      if (userToLogin && userToLogin.password === requestBody.password) {
        const token = toToken({ userId: userToLogin.id });
        res.status(200).send({ token: token });
        return;
      }
      res.status(400).send({ message: "Login failed" });
    } catch (error) {
      console.error("Error in /login endpoint:", error);
      res.status(500).send({ message: "Something went wrong!" });
    }
  } else {
    res
      .status(400)
      .send({ message: "'username' and 'password' are required!" });
  }
});

//POST/register
app.post("/register", async (req, res) => {
  const requestBody = req.body;
  if ("username" in requestBody && "password" in requestBody) {
    try {
      await prisma.user.create({
        data: requestBody,
      });
      res.status(201).send({ message: "User created!" });
    } catch (error) {
      // If we get an error, send back HTTP 500 (Server Error)
      res.status(500).send({ message: "huhu,500" });
    }
  } else {
    // If we are missing fields, send back a HTTP 400
    res.status(400).send({ message: "'username'and 'password' is required!" });
  }
});

//GET/ ALL MENU ITEMS
app.get("/menu-items", async (req, res) => {
  try {
    const allMenuItems = await prisma.menuItem.findMany({
      select: {
        id: true,
        name: true,
        imgURL: true,
      },
    });
    console.log("All menu's items fetch successfully:", allMenuItems);
    res.send(allMenuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

app.listen(port, () => console.log(`⚡ Listening on port: ${port}`));
