import { PrismaClient, RestaurantCategory } from "@prisma/client";

const prisma = new PrismaClient();

const restaurants = [
  { id: "fengjia-hun-pasta", name: "HUN混 義大利麵 逢甲店", category: RestaurantCategory.NOODLE, address: "台中市西屯區文華路217-8號", phone: "04-27085878", rating: 4.5, priceRange: "$200-$400" },
  { id: "fengjia-shapa-pasta", name: "夏帕義大利麵 逢甲店", category: RestaurantCategory.NOODLE, address: "台中市西屯區文華路100號", phone: "04-24521379", rating: 4.8, priceRange: "$200-$400" },
  { id: "fengjia-mr38-curry", name: "Mr.38 咖哩美食餐廳（逢甲店）", category: RestaurantCategory.JAPANESE, address: "台中市西屯區至善路212號", phone: "04-24528188", rating: 4.6, priceRange: "$200-$400" },
  { id: "fengjia-red-ghost-steak", name: "赤鬼炙燒牛排 逢甲店", category: RestaurantCategory.OTHER, address: "台中市西屯區文華路11號", phone: "04-24527277", rating: 4.3, priceRange: "$200-$500" },
  { id: "fengjia-home-yakiniku", name: "HOME燒肉-逢甲店", category: RestaurantCategory.JAPANESE, address: "台中市西屯區河南路二段256號", phone: "04-27003689", rating: 4.8, priceRange: "$658-$1098" },
  { id: "fengjia-jing-hou-wu", name: "京厚屋-逢甲店", category: RestaurantCategory.JAPANESE, address: "台中市西屯區河南路二段255-1號", phone: "04-24522646", rating: 4.5, priceRange: "$168-$430" },
  { id: "fengjia-pig-korean-bbq", name: "豬對有韓式烤肉吃到飽 台中逢甲店", category: RestaurantCategory.KOREAN, address: "台中市西屯區福星路249號", phone: "04-24511998", rating: 4.5, priceRange: "$329-$399" },
  { id: "fengjia-park-korean-chicken", name: "朴大哥的韓式炸雞逢甲總店", category: RestaurantCategory.KOREAN, address: "台中市西屯區逢甲路20巷28弄5號", phone: "0988328178", rating: 4.5 },
  { id: "fengjia-zhou-da-fu", name: "粥大福-台中逢甲店", category: RestaurantCategory.RICE, address: "台中市西屯區福星路614號", phone: "04-24522006", rating: 4.3 },
  { id: "fengjia-long-xian-ju", name: "龍涎居雞膳食坊 逢甲店", category: RestaurantCategory.RICE, address: "台中市西屯區福星路405號", phone: "04-24518283", rating: 4.2 },
  { id: "fengjia-shi-er-duan-hotpot", name: "十二段鍋物堂｜逢甲店", category: RestaurantCategory.HOTPOT, address: "台中市西屯區河南路二段241-1號", phone: "04-24520025", rating: 4.8 },
  { id: "fengjia-lao-chen-zi", name: "老臣子酸辣粉", category: RestaurantCategory.NOODLE, address: "台中市西屯區逢甲路86號", phone: "04-24528376", rating: 4.4 },
  { id: "fengjia-daily-cafe", name: "日常日嚐早午晚餐咖啡廳逢甲店", category: RestaurantCategory.NOODLE, address: "台中市西屯區文華路138巷1-1號", phone: "0918007918", menuUrl: "https://downshifting.chenhsinyu.com/menu.html", websiteUrl: "https://downshifting.chenhsinyu.com/", rating: 4.2 },
  { id: "fengjia-chun-san-zhao", name: "春三朝", category: RestaurantCategory.OTHER, address: "台中市西屯區上石路179號", phone: "04-24529855", rating: 4.5 },
  { id: "fengjia-bing-shu-corn", name: "炳叔烤玉米逢甲總店", category: RestaurantCategory.OTHER, address: "台中市西屯區文華路10之8號", phone: "04-24510955", rating: 4.0 },
  { id: "fengjia-guan-zhi-lin", name: "官芝霖大腸包小腸", category: RestaurantCategory.OTHER, address: "台中市西屯區逢甲路22號", phone: "0922282559", rating: 3.9 },
  { id: "fengjia-thai-spicy-ribs", name: "泰辛火山排骨-逢甲夜市店", category: RestaurantCategory.THAI, address: "台中市西屯區文華路71號", phone: "0968363989", rating: 4.5 },
  { id: "fengjia-lianting-hotpot", name: "聯亭泡菜鍋 逢甲旗艦店", category: RestaurantCategory.HOTPOT, address: "台中市西屯區福星北路7號", phone: "04-24515167", websiteUrl: "https://lianting.tw/store", rating: 4.8 },
  { id: "fengjia-dajia-taro", name: "大甲芋頭城逢甲店", category: RestaurantCategory.DESSERT, address: "台中市西屯區福星路461巷2號", phone: "04-24525817", rating: 4.0 },
  { id: "fengjia-minglun-egg-pancake", name: "明倫蛋餅 逢甲福星店", category: RestaurantCategory.OTHER, address: "台中市西屯區福星路546號", phone: "0975791179", rating: 3.7 },
].map((restaurant) => ({
  ...restaurant,
  description: null,
  latitude: null,
  longitude: null,
  imageUrl: null,
  orderUrl: null,
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`,
}));

async function main() {
  for (const restaurant of restaurants) {
    const { id, ...data } = restaurant;
    await prisma.restaurant.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
  console.log(`Seeded ${restaurants.length} Fengjia restaurants.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });