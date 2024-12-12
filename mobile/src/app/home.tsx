import { useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { router } from "expo-router";

import { Places } from "@/components/places";

import { Categories } from "@/components/categories";
import { MOCKED_CURRENT_LOCATION } from "@/constants/location";
import { getCategories, getMarketsByCategory } from "@/services/api";
import { useQuery } from "@/services/reactQuery";

export default function Home() {
  const [category, setCategory] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await getCategories();

      setCategory(data[0].id);

      return data;
    },
  });

  const { data: markets } = useQuery({
    queryKey: ["markets", category],
    queryFn: () => getMarketsByCategory(category),
    enabled: !!category,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: MOCKED_CURRENT_LOCATION.latitude,
          longitude: MOCKED_CURRENT_LOCATION.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          identifier="current"
          coordinate={{
            latitude: MOCKED_CURRENT_LOCATION.latitude,
            longitude: MOCKED_CURRENT_LOCATION.longitude,
          }}
          image={require("@/assets/location.png")}
        />

        {markets?.data?.map((item) => (
          <Marker
            key={item.id}
            identifier={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            image={require("@/assets/pin.png")}
            title={item.name}
            description={item.address}
            onCalloutPress={() => router.navigate(`/market/${item.id}`)}
          />
        ))}
      </MapView>

      <Places data={markets?.data} />
    </View>
  );
}
