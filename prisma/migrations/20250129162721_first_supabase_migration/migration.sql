/*
  Warnings:

  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[custom_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BeatLicense" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "pruchased" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DownloadLink" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '48 hours';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "price",
ADD COLUMN     "custom_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_custom_id_key" ON "Order"("custom_id");

-- AddForeignKey
ALTER TABLE "BeatLicense" ADD CONSTRAINT "BeatLicense_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
