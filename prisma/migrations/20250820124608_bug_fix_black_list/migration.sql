/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `black_listed_tokens` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_black_listed_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "black_listed_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_black_listed_tokens" ("createdAt", "id", "token", "userId") SELECT "createdAt", "id", "token", "userId" FROM "black_listed_tokens";
DROP TABLE "black_listed_tokens";
ALTER TABLE "new_black_listed_tokens" RENAME TO "black_listed_tokens";
CREATE UNIQUE INDEX "black_listed_tokens_token_key" ON "black_listed_tokens"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
