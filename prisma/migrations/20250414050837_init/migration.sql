/*
  Warnings:

  - A unique constraint covering the columns `[productId,colorId,storage]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_colorId_storage_key" ON "Variant"("productId", "colorId", "storage");
