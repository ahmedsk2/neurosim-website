-- CreateTable
CREATE TABLE "SmtpSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "host" TEXT,
    "port" INTEGER NOT NULL DEFAULT 587,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "user" TEXT,
    "pass" TEXT,
    "from" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "updatedById" TEXT
);
