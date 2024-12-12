import { PropsDetails } from "@/components/market/details";
import { api } from "@/services/axios";

type MarketDetailsProps = PropsDetails & {
  cover: string;
};
export const getMarketDetails = async (marketId: string) => {
  try {
    return await api.get<MarketDetailsProps>(`/markets/${marketId}`);
  } catch (error) {
    throw new Error("Failed to fetch market details");
  }
};
