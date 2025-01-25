/*
  Warnings:

  - You are about to drop the column `price` on the `Beat` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `Beat` table. All the data in the column will be lost.
  - You are about to drop the column `beatId` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `beatId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Producer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[licenseId]` on the table `Download` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licenseId` to the `Download` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Download` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Producer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Producer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Producer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_beatId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_beatId_fkey";

-- AlterTable
ALTER TABLE "Beat" DROP COLUMN "price",
DROP COLUMN "stripePriceId",
ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "beatId",
DROP COLUMN "expiresAt",
ADD COLUMN     "licenseId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "beatId";

-- AlterTable
ALTER TABLE "Producer" DROP COLUMN "name",
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BeatLicense" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "beatId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "licenseOptionId" TEXT NOT NULL,

    CONSTRAINT "BeatLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseOption" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contents" TEXT[],
    "usageTerms" TEXT[],

    CONSTRAINT "LicenseOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLink" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '48 hours',
    "downloadId" TEXT NOT NULL,

    CONSTRAINT "DownloadLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Download_licenseId_key" ON "Download"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_username_key" ON "Producer"("username");

-- AddForeignKey
ALTER TABLE "Beat" ADD CONSTRAINT "Beat_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatLicense" ADD CONSTRAINT "BeatLicense_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatLicense" ADD CONSTRAINT "BeatLicense_licenseOptionId_fkey" FOREIGN KEY ("licenseOptionId") REFERENCES "LicenseOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "BeatLicense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
