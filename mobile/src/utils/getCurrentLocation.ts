import * as Location from "expo-location";
export async function getCurrentLocation() {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (granted) {
      const location = await Location.getCurrentPositionAsync();
      console.log(location);
    }
  } catch (error) {
    console.log(error);
  }
}
