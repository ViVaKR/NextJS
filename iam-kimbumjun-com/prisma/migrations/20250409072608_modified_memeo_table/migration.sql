/*
  Warnings:

  - You are about to drop the `Memo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Memo";

-- CreateTable
CREATE TABLE "memos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);
