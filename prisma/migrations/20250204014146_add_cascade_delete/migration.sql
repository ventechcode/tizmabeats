-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_licenseId_fkey";

-- AlterTable
ALTER TABLE "DownloadLink" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '48 hours';

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "BeatLicense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
