import { PrismaClient } from "@prisma/client";
import usersData from "./data/users.json";
import ordersData from "./data/orders.json";
import sugarLevelData from "./data/sugarLevel.json";
import iceLevelData from "./data/iceLevel.json";
import teasData from "./data/teas.json";
import milksData from "./data/milks.json";
import flavorsData from "./data/flavors.json";
import toppingsData from "./data/toppings.json";
import sizesData from "./data/sizes.json";
import cupsData from "./data/cups.json";
const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Seed Users
    for (let i = 0; i < usersData.length; i++) {
      const userData = usersData[i];
      await prisma.user.create({
        data: {
          username: userData.username,
          password: userData.password,
        },
      });
    }
    console.log("Seeding users completed.");

    // Seed Teas
    for (let i = 0; i < teasData.length; i++) {
      const teaData = teasData[i];
      await prisma.tea.create({
        data: {
          name: teaData.name,
          price: teaData.price,
        },
      });
    }
    console.log("Seeding teas completed.");

    // Seed Milks
    for (let i = 0; i < milksData.length; i++) {
      const milkData = milksData[i];
      await prisma.milk.create({
        data: {
          name: milkData.name,
          price: milkData.price,
        },
      });
    }
    console.log("Seeding milks completed.");

    // Seed Flavors
    for (let i = 0; i < flavorsData.length; i++) {
      const flavorData = flavorsData[i];
      await prisma.flavor.create({
        data: {
          name: flavorData.name,
        },
      });
    }
    console.log("Seeding flavors completed.");

    // Seed Toppings
    for (let i = 0; i < toppingsData.length; i++) {
      const toppingData = toppingsData[i];
      await prisma.topping.create({
        data: {
          name: toppingData.name,
          price: toppingData.price,
        },
      });
    }
    console.log("Seeding toppings completed.");

    //Seed Size
    for (let i = 0; i < sizesData.length; i++) {
      const sizeData = sizesData[i];
      await prisma.size.create({
        data: {
          name: sizeData.name,
          price: sizeData.price,
        },
      });
    }
    console.log("Seeding sizes completed.");

    // Seed Sugar Levels
    for (let i = 0; i < sugarLevelData.length; i++) {
      const sugarLevel = sugarLevelData[i];
      await prisma.sugarLevel.create({
        data: sugarLevel,
      });
    }
    console.log("Seeding sugar levels completed.");

    // Seed Ice Levels
    for (let i = 0; i < iceLevelData.length; i++) {
      const iceLevel = iceLevelData[i];
      await prisma.iceLevel.create({
        data: iceLevel,
      });
    }
    console.log("Seeding ice levels completed.");

    //Seed Cups
    for (let i = 0; i < cupsData.length; i++) {
      const cupData = cupsData[i];
      await prisma.cup.create({
        data: cupData,
      });
    }
    console.log("Seeding cups completed.");

    // Seed Orders
    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i];
      await prisma.order.create({
        data: orderData,
      });
    }
    console.log("Seeding orders completed.");

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seed();
