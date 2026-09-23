-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RestaurantCategory" AS ENUM ('RICE', 'NOODLE', 'JAPANESE', 'THAI', 'KOREAN', 'HOTPOT', 'DESSERT', 'DRINK', 'OTHER');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "RestaurantCategory" NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION,
    "priceRange" TEXT,
    "imageUrl" TEXT,
    "websiteUrl" TEXT,
    "menuUrl" TEXT,
    "orderUrl" TEXT,
    "googleMapsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Restaurant_category_idx" ON "Restaurant"("category");

-- CreateIndex
CREATE INDEX "Restaurant_name_idx" ON "Restaurant"("name");