/*
  Warnings:

  - Added the required column `genre` to the `Beat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Beat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "audioSrc" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "producerId" TEXT NOT NULL,
    "purchased" BOOLEAN NOT NULL,
    "genre" TEXT NOT NULL,
    "length" REAL NOT NULL,
    CONSTRAINT "Beat_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Beat" ("audioSrc", "bpm", "createdAt", "id", "key", "name", "price", "producerId", "purchased", "updatedAt") SELECT "audioSrc", "bpm", "createdAt", "id", "key", "name", "price", "producerId", "purchased", "updatedAt" FROM "Beat";
DROP TABLE "Beat";
ALTER TABLE "new_Beat" RENAME TO "Beat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
