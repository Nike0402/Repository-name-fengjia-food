import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.restaurant.count();
    if (count === 0) return Response.json({ error: "目前沒有餐廳資料" }, { status: 404 });
    const skip = Math.floor(Math.random() * count);
    const [restaurant] = await prisma.restaurant.findMany({ take: 1, skip, orderBy: { id: "asc" } });
    return Response.json({ data: restaurant });
  } catch (error) {
    console.error("GET /api/restaurants/random failed", error);
    return Response.json({ error: "無法取得隨機餐廳" }, { status: 500 });
  }
}