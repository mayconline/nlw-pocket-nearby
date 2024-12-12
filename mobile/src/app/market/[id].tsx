import { View, Modal, StatusBar, ScrollView } from "react-native";
import { useLocalSearchParams, Redirect } from "expo-router";
import { CameraView } from "expo-camera";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Coupon } from "@/components/market/coupon";
import { Details } from "@/components/market/details";

import { getMarketDetails } from "@/services/api";
import { useQuery } from "@/services/reactQuery";

import { useCoupon } from "@/hooks/useCoupon";

export default function Market() {
  const {
    coupon,
    couponIsFetching,
    qrLock,
    isVisibleCameraModal,
    setIsVisibleCameraModal,
    handleOpenCamera,
    handleUseCoupon,
  } = useCoupon();

  const params = useLocalSearchParams<{ id: string }>();

  const { data: marketDetails, isFetching: setIsLoading } = useQuery({
    queryKey: ["marketDetails", params?.id],
    queryFn: () => getMarketDetails(params?.id),
    enabled: !!params?.id,
  });

  if (setIsLoading) {
    return <Loading />;
  }

  if (!marketDetails?.data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={marketDetails?.data?.cover} />
        <Details data={marketDetails?.data} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => handleUseCoupon(data), 500);
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
