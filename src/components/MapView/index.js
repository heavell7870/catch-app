import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Platform } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../redux/actions/main";
import { SET_USER_LOCATION } from "../../redux/actions/types";
import { useNavigation } from "@react-navigation/native";
import { CONSTANTS } from "../../Constants";

export default function MapViewCustom({ map_ref, data, location_update }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user_location, user_data } = useSelector((state) => state.reducer);

  useEffect(() => {
    getLoc();
  }, []);
  console.log(user_data);

  const getLoc = async () => {
    const loc = await dispatch(getLocation());
    dispatch({
      type: SET_USER_LOCATION,
      data: { ...loc.coords, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    });
    setLoading(false);
    console.log(loc);
  };

  if (loading) {
    return null;
  }

  return (
    <MapView
      ref={map_ref}
      initialRegion={user_location}
      showsUserLocation={true}
      mapPadding={{ top: 50, bottom: 60 }}
      showsMyLocationButton={true}
      provider={Platform.OS == "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      onRegionChangeComplete={(e) => location_update(e)}
      style={{ height: "100%", width: "100%" }}
    >
      {user_data.type != "driver" ? (
        data.map((item) => {
          return (
            <Marker
              onPress={() =>
                navigation.navigate(CONSTANTS.SCREENS.vehicleDetails, { item })
              }
              key={item.id}
              pinColor={item.category?.color ? item.category?.color : "red"}
              coordinate={{
                latitude: item.coordinates?.coordinates[1],
                longitude: item.coordinates?.coordinates[0],
              }}
            ></Marker>
          );
        })
      ) : (
        <Marker
          pinColor={
            user_data.vehicle_data?.color
              ? user_data.vehicle_data?.color
              : "red"
          }
          coordinate={{
            latitude: user_data.coordinates?.coordinates[1],
            longitude: user_data.coordinates?.coordinates[0],
          }}
        />
      )}
    </MapView>
  );
}
