import { useRef, useState } from "react";
import { Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { MOCKED_COUPON } from "@/constants/coupon";
import { updateCoupon } from "@/services/api";

export const useCoupon = () => {
  const [coupon, setCoupon] = useState<string | null>(MOCKED_COUPON);
  const [couponIsFetching, setCouponIsFetching] = useState(false);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

  const [_, requestPermission] = useCameraPermissions();

  const qrLock = useRef(false);

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }

      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      Alert.alert("Câmera", "Não foi possível utilizar a câmera");
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await updateCoupon(id);

      console.log(data);

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }

  return {
    isVisibleCameraModal,
    qrLock,
    coupon,
    couponIsFetching,
    handleOpenCamera,
    handleUseCoupon,
    setIsVisibleCameraModal,
  };
};
