-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gitSha" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Heading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "anchorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Heading_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reviewer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'validator',
    "specialty" TEXT,
    "credentials" TEXT,
    "conflictOfInterest" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" TEXT NOT NULL,
    "sectionAnchor" TEXT,
    "sectionTextSnapshot" TEXT,
    "quotedText" TEXT,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "suggestedFix" TEXT,
    "suggestedCitation" TEXT,
    "filedGitSha" TEXT NOT NULL,
    "filedContentHash" TEXT NOT NULL,
    "reviewedContentHash" TEXT,
    "authorId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "priority" INTEGER,
    "resolutionNote" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" DATETIME,
    "verifiedById" TEXT,
    "verifiedAt" DATETIME,
    "duplicateOfId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Finding_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Finding_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Reviewer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Finding_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Reviewer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Finding_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "Reviewer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Finding_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Reviewer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Finding_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Finding" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FindingComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "findingId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FindingComment_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FindingComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Reviewer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FindingAudit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "findingId" INTEGER NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "detail" TEXT,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FindingAudit_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FindingAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Reviewer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FindingAttachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "findingId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FindingAttachment_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FindingAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Reviewer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_kind_slug_key" ON "Page"("kind", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Heading_pageId_anchorId_key" ON "Heading"("pageId", "anchorId");

-- CreateIndex
CREATE INDEX "Finding_pageId_idx" ON "Finding"("pageId");

-- CreateIndex
CREATE INDEX "Finding_status_idx" ON "Finding"("status");

-- CreateIndex
CREATE INDEX "Finding_severity_idx" ON "Finding"("severity");

-- CreateIndex
CREATE INDEX "Finding_status_pageId_idx" ON "Finding"("status", "pageId");

-- CreateIndex
CREATE INDEX "FindingComment_findingId_idx" ON "FindingComment"("findingId");

-- CreateIndex
CREATE INDEX "FindingAudit_findingId_idx" ON "FindingAudit"("findingId");

-- CreateIndex
CREATE INDEX "FindingAttachment_findingId_idx" ON "FindingAttachment"("findingId");
