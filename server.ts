import cors from "cors";
import express, { json } from "express";
import { PrismaClient } from "@prisma/client";
import { toToken } from "./auth/jwt";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
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

const orderCreateValidator = z
  .object({
    sugarLevelId: z.number().int().positive(),
    iceLevelId: z.number().int().positive(),
    cupId: z.number().int().positive(),
    sizeId: z.number().int().positive(),
    teaId: z.number().int().positive(),
    milkId: z.number().int().positive(),
    flavorId: z.number().int().positive(),
    toppingId: z.number().int().positive(),
  })
  .strict();

app.get("/greeting", (req, res) => {
  const messageFromEnv = process.env.MESSAGE;
  res.send(messageFromEnv);
});

//GET/data for order
app.get("/options", async (req, res) => {
  const allIce = await prisma.iceLevel.findMany();
  const allSize = await prisma.size.findMany();
  const allCup = await prisma.cup.findMany();
  const allSugar = await prisma.sugarLevel.findMany();
  const allFlavor = await prisma.flavor.findMany();
  const allTopping = await prisma.topping.findMany();
  const allTea = await prisma.tea.findMany();
  const allMilk = await prisma.milk.findMany();
  const result = {
    iceLevels: allIce,
    sizes: allSize,
    cups: allCup,
    sugarLevels: allSugar,
    flavors: allFlavor,
    toppings: allTopping,
    teas: allTea,
    milk: allMilk,
  };
  res.send(result);
});

//POST/orders
app.post("/orders", AuthMiddleware, async (req: AuthRequest, res) => {
  const { userId } = req;
  const reqBody = req.body;

  if (!userId) {
    return res.status(401).send({
      message: "User ID is missing",
    });
  }

  const validatedOrder = orderCreateValidator.safeParse(reqBody);
  if (!validatedOrder.success) {
    return res.status(400).send({
      message: "Validation failed",
      errors: validatedOrder.error.flatten(),
    });
  }

  try {
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        ...validatedOrder.data,
      },
    });
    res
      .status(201)
      .send({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({
      message: "Internal server error",
      // error: error && "message" in error && error.message,
    });
  }
});

//GET/orders
app.get("/orders", AuthMiddleware, async (req: AuthRequest, res) => {
  try {
    const { userId } = req;
    const userOrders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        cup: { select: { name: true, price: true } },
        iceLevel: { select: { name: true } },
        sugarLevel: { select: { name: true } },
        size: { select: { name: true, price: true } },
        flavor: { select: { name: true } },
        tea: { select: { name: true, price: true } },
        milk: { select: { name: true, price: true } },
        topping: { select: { name: true } },
      },
    });
    res.status(200).json(userOrders);
    // console.log("All orders:", userOrders); // Add logging
    // res.send(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

app.delete("/orders/:id", AuthMiddleware, async (req: AuthRequest, res) => {
  const idFromReq = Number(req.params.id);
  const user = req.userId;

  if (isNaN(idFromReq)) {
    res.status(400).send();
    return;
  }

  const orderToDelete = await prisma.order.findUnique({
    where: { id: idFromReq, userId: user },
  });

  if (orderToDelete === null) {
    res.status(404).send();
    return;
  }

  await prisma.order.delete({
    where: { id: idFromReq },
  });
  res.status(200).send({ message: "Order was deleted" });
});
app.listen(port, () => console.log(`⚡ Listening on port: ${port}`));
