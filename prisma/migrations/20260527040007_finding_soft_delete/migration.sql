-- AlterTable
ALTER TABLE "Finding" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "Finding" ADD COLUMN "deletedById" TEXT;
