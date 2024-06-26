import { PrismaClient } from "@prisma/client";
import usersData from "./data/users.json";
import ordersData from "./data/orders.json";
import menuItemsData from "./data/menuItems.json";
import sugarLevelData from "./data/sugarLevel.json";
import iceLevelData from "./data/iceLevel.json";
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

    // Seed Menu Items
    for (let i = 0; i < menuItemsData.length; i++) {
      const menuItemData = menuItemsData[i];
      await prisma.menuItem.create({
        data: menuItemData,
      });
    }
    console.log("Seeding menu items completed.");

    //Seed Sugar
    for (let i = 0; i < sugarLevelData.length; i++) {
      const sugarLevelsData = sugarLevelData[i];
      await prisma.sugarLevel.create({
        data: sugarLevelsData,
      });
    }

    //Seed Ice
    for (let i = 0; i < iceLevelData.length; i++) {
      const iceLevelsData = iceLevelData[i];
      await prisma.iceLevel.create({
        data: iceLevelsData,
      });
    }
    console.log("Seeding ice levels completed.");

    //Seed Orders
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
