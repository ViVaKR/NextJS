-- CreateTable
CREATE TABLE "public"."memos" (
    "id" SERIAL NOT NULL,
    "memo" TEXT NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);
