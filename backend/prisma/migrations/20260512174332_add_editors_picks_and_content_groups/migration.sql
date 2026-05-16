-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "editorsPick" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editorsPickOrder" INTEGER,
ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "groupOrder" INTEGER;

-- CreateTable
CREATE TABLE "ContentGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentGroup_type_idx" ON "ContentGroup"("type");

-- CreateIndex
CREATE INDEX "Content_editorsPick_idx" ON "Content"("editorsPick");

-- CreateIndex
CREATE INDEX "Content_groupId_idx" ON "Content"("groupId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ContentGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
