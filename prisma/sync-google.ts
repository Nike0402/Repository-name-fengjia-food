import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

type GooglePlace = {
  rating?: number;
  priceLevel?: string;
  displayName?: { text?: string };
};

type GooglePlacesResponse = {
  places?: GooglePlace[];
  error?: { message?: string };
};

const priceLevels: Record<string, string> = {
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

async function findGooglePlace(name: string, address: string) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": googleMapsApiKey!,
      "X-Goog-FieldMask": "places.rating,places.priceLevel,places.displayName",
    },
    body: JSON.stringify({
      textQuery: `${name} ${address}`,
      languageCode: "zh-TW",
      regionCode: "TW",
      maxResultCount: 1,
    }),
  });

  const payload = await response.json() as GooglePlacesResponse;
  if (!response.ok) throw new Error(payload.error?.message ?? `Google Places API failed (${response.status})`);
  return payload.places?.[0] ?? null;
}

async function main() {
  if (!googleMapsApiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY in .env.local");

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true, address: true },
    orderBy: { name: "asc" },
  });

  for (const restaurant of restaurants) {
    try {
      const place = await findGooglePlace(restaurant.name, restaurant.address);
      if (!place) {
        console.log(`No Google place found: ${restaurant.name}`);
        continue;
      }

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          ...(place.rating !== undefined && { rating: place.rating }),
          ...(place.priceLevel && priceLevels[place.priceLevel] && { priceRange: priceLevels[place.priceLevel] }),
        },
      });
      console.log(`Updated ${place.displayName?.text ?? restaurant.name}: ${place.rating ?? "-"} / ${priceLevels[place.priceLevel ?? ""] ?? "-"}`);
    } catch (error) {
      console.error(`Failed to update ${restaurant.name}:`, error);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
