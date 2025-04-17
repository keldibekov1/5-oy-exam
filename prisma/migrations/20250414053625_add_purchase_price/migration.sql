/*
  Warnings:

  - You are about to drop the column `purchasePrice` on the `Variant` table. All the data in the column will be lost.
  - Added the required column `purchasePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "purchasePrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "purchasePrice";
