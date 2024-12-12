import { api } from "@/services/axios";

export const updateCoupon = async (couponId: string) => {
  try {
    return await api.patch(`/coupons/${couponId}`);
  } catch (error) {
    throw new Error("Failed to update coupon");
  }
};
