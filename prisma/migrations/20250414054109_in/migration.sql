/*
  Warnings:

  - You are about to drop the column `purchasePrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `purchasePrice` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Variant_productId_colorId_storage_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "purchasePrice";

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "purchasePrice" DOUBLE PRECISION NOT NULL;
