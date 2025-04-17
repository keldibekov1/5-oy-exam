/*
  Warnings:

  - You are about to drop the column `exchangeDate` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `newCondition` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `newPrice` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `newProductId` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `oldCondition` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Exchange` table. All the data in the column will be lost.
  - You are about to alter the column `oldPrice` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `difference` to the `Exchange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Exchange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Exchange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `Exchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_newProductId_fkey";

-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_transactionId_fkey";

-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "exchangeDate",
DROP COLUMN "newCondition",
DROP COLUMN "newPrice",
DROP COLUMN "newProductId",
DROP COLUMN "oldCondition",
DROP COLUMN "transactionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difference" INTEGER NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "unitPrice" INTEGER NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "oldPrice" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
