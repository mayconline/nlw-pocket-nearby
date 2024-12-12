import { CategoriesProps } from "@/components/categories";
import { api } from "@/services/axios";

export const getCategories = async () => {
  try {
    return await api.get<CategoriesProps[]>("/categories");
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};
