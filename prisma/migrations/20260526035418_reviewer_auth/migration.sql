/*
  Warnings:

  - Added the required column `email` to the `Reviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Reviewer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviewer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'validator',
    "specialty" TEXT,
    "credentials" TEXT,
    "conflictOfInterest" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reviewer" ("conflictOfInterest", "createdAt", "credentials", "id", "isActive", "name", "role", "specialty") SELECT "conflictOfInterest", "createdAt", "credentials", "id", "isActive", "name", "role", "specialty" FROM "Reviewer";
DROP TABLE "Reviewer";
ALTER TABLE "new_Reviewer" RENAME TO "Reviewer";
CREATE UNIQUE INDEX "Reviewer_email_key" ON "Reviewer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
