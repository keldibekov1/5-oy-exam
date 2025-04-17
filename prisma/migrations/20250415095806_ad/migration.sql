/*
  Warnings:

  - Added the required column `quantity` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
