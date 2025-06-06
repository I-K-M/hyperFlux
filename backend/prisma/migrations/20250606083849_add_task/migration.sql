-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);