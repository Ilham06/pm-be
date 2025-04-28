-- AlterTable
ALTER TABLE "EventDocument" ADD COLUMN     "note" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
