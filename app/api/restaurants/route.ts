import { RestaurantCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const categoryValues = new Set(Object.values(RestaurantCategory).map((value) => value.toLowerCase()));

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toLowerCase();
    const search = searchParams.get("search")?.trim();
    if (category && !categoryValues.has(category)) return Response.json({ error: "無效的餐廳分類" }, { status: 400 });
    const restaurants = await prisma.restaurant.findMany({
      where: {
        ...(category && { category: category.toUpperCase() as RestaurantCategory }),
        ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { address: { contains: search, mode: "insensitive" } }] }),
      },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
    });
    return Response.json({ data: restaurants });
  } catch (error) {
    console.error("GET /api/restaurants failed", error);
    return Response.json({ error: "無法取得餐廳資料" }, { status: 500 });
  }
}