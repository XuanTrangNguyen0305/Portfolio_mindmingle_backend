import cors from "cors";
import express, { json } from "express";
import { PrismaClient } from "@prisma/client";
import { toToken } from "./auth/jwt";
import { AuthMiddleware, AuthRequest } from "./auth/middleware";
import { z } from "zod";
const app = express();
app.use(cors());
const port = 3001;
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
app.post("/orders", async (req, res) => {
  const reqBody = req.body;

  const validatedOrder = orderCreateValidator.safeParse(reqBody);
  if (validatedOrder.success) {
    try {
      const newOrder = await prisma.order.create({
        data: {
          ...validatedOrder.data,
        },
      });
      res
        .status(201)
        .send({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while creating the item");
    }
  } else {
    res.status(400).send({
      message: "Wrong body data",
      error: validatedOrder.error?.flatten(),
    });
  }
});

//GET/orders
app.get("/orders", async (req, res) => {
  try {
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        cup: { select: { name: true, price: true } },
        iceLevel: { select: { name: true } },
        sugarLevel: { select: { name: true } },
        size: { select: { name: true, price: true } },
        flavor: { select: { name: true } },
        tea: { select: { name: true } },
        milk: { select: { name: true, price: true } },
        topping: { select: { name: true } },
      },
    });
    console.log("All orders:", allOrders); // Add logging
    res.send(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

app.listen(port, () => console.log(`⚡ Listening on port: ${port}`));
