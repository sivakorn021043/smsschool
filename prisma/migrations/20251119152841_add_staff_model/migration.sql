-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "profile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);
