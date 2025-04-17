import { Variant } from "@prisma/client";

export class GetProductDto {
    id: string;
    name: string;
    model: string;
    categoryId: string;
    price: number;
    purchasePrice: number;
    variants: Variant[];
  }
  