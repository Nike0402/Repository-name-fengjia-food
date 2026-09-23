import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) return Response.json({ error: "找不到這間餐廳" }, { status: 404 });
    return Response.json({ data: restaurant });
  } catch (error) {
    console.error("GET /api/restaurants/[id] failed", error);
    return Response.json({ error: "無法取得餐廳資料" }, { status: 500 });
  }
}