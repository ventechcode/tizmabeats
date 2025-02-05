-- DropForeignKey
ALTER TABLE "DownloadLink" DROP CONSTRAINT "DownloadLink_downloadId_fkey";

-- AlterTable
ALTER TABLE "DownloadLink" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '48 hours';

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;
