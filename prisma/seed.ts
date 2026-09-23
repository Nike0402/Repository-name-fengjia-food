import { PrismaClient, RestaurantCategory } from "@prisma/client";

const prisma = new PrismaClient();

const restaurants = [
  {
    id: "seed-rice-01",
    name: "逢甲飯食堂",
    category: RestaurantCategory.RICE,
    description: "逢甲商圈的日常飯食選擇。",
    address: "台中市西屯區文華路附近",
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-noodle-01",
    name: "逢甲麵屋",
    category: RestaurantCategory.NOODLE,
    description: "提供湯麵與乾麵的簡單選擇。",
    address: "台中市西屯區福星路附近",
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-japanese-01",
    name: "逢甲日和",
    category: RestaurantCategory.JAPANESE,
    description: "日式定食與丼飯。",
    address: "台中市西屯區逢甲路附近",
    priceRange: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-thai-01",
    name: "逢甲泰味",
    category: RestaurantCategory.THAI,
    description: "酸辣開胃的泰式料理。",
    address: "台中市西屯區河南路附近",
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-korean-01",
    name: "逢甲韓食",
    category: RestaurantCategory.KOREAN,
    description: "韓式拌飯、炸雞與小菜。",
    address: "台中市西屯區西安街附近",
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-hotpot-01",
    name: "逢甲鍋物",
    category: RestaurantCategory.HOTPOT,
    description: "個人鍋與多人鍋物。",
    address: "台中市西屯區福星北路附近",
    priceRange: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-dessert-01",
    name: "逢甲甜點所",
    category: RestaurantCategory.DESSERT,
    description: "散步時適合外帶的甜點。",
    address: "台中市西屯區慶和街附近",
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-drink-01",
    name: "逢甲茶飲站",
    category: RestaurantCategory.DRINK,
    description: "茶飲與季節限定飲品。",
    address: "台中市西屯區逢甲路附近",
    priceRange: "$",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "seed-other-01",
    name: "逢甲小吃集合",
    category: RestaurantCategory.OTHER,
    description: "提供分類以外的在地小吃選擇。",
    address: "台中市西屯區文華路附近",
    priceRange: "$",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
  },
];

async function main() {
  for (const restaurant of restaurants) {
    await prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: restaurant,
      create: restaurant,
    });
  }
  console.log(`Seeded ${restaurants.length} restaurants.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });