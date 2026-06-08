import  prisma  from "../lib/prisma.ts";
import type { Categories } from "../types/categories.ts";

export const getCategories = async(): Promise<Categories[]> => {
    const categories = await prisma.categories.findMany();
    return categories;
}