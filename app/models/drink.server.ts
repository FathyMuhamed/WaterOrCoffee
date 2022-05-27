import { db } from "~/db.server";

type TDrink = {
  id: number;
  name: string;
};

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

export async function getDrink(): Promise<Array<TDrink>> {
  return await db.drink.findMany({
    where: {
      createdAt: {
        gte: todayDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
export async function createDrink(name: string) {
  return await db.drink.create({
    data: {
      name,
    },
  });
}
