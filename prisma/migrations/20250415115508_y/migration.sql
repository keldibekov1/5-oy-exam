/*
  Warnings:

  - You are about to drop the `_ProductExchanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductExchanges" DROP CONSTRAINT "_ProductExchanges_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductExchanges" DROP CONSTRAINT "_ProductExchanges_B_fkey";

-- DropTable
DROP TABLE "_ProductExchanges";

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_oldProductId_fkey" FOREIGN KEY ("oldProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_newProductId_fkey" FOREIGN KEY ("newProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
