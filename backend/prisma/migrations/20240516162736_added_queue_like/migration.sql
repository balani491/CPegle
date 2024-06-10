-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);
