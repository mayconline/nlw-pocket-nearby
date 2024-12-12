import { PlaceProps } from "@/components/place";
import { api } from "@/services/axios";

type MarketsProps = PlaceProps & {
  latitude: number;
  longitude: number;
};

export const getMarketsByCategory = async (category: string) => {
  try {
    return await api.get<MarketsProps[]>(`/markets/category/${category}`);
  } catch (error) {
    throw new Error("Failed to fetch markets by categories");
  }
};
