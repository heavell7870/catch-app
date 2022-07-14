import common_axios from "../../utils/axios";
import {
  IS_USER,
  SET_COMMODITIES,
  LOGOUT_MODAL,
  USER_DATA,
  VEHICLE_TYPES,
} from "./types";
import * as Location from "expo-location";
import Toast from "../../components/Toast/Toast";
import axios from "axios";

export const setIsUser = (val) => ({
  type: IS_USER,
  data: val,
});

export const setUserData = (val) => ({
  type: USER_DATA,
  data: val,
});

export const setLogoutModal = (val) => ({
  type: LOGOUT_MODAL,
  data: val,
});

export const setCommodities = (val) => ({
  type: SET_COMMODITIES,
  data: val,
});

export const getCommodities = () => async (dispatch) => {
  try {
    const { data } = await common_axios.get("/category");
    if (data.data) {
      dispatch({ type: SET_COMMODITIES, data: data.data });
    }
  } catch (e) {
    console.log(e);
  }
};

export const getLocation = () => async (dispatch) => {
  let { status: permission } =
    await Location.requestForegroundPermissionsAsync();
  if (permission !== "granted") {
    dispatch(setLocationDenied(true));
    return;
  }
  await Location.enableNetworkProviderAsync()
    .then()
    .catch((_) => null);
  const status = await Location.hasServicesEnabledAsync();
  if (status) {
    const getCurrentPosition = async () =>
      await Location.getCurrentPositionAsync()
        .then((loc) => loc)
        .catch((_) => null);
    let location = await getCurrentPosition();
    while (location === null) {
      location = await getCurrentPosition();
    }
    return location;
  } else {
    throw new Error("Please activate the location");
  }
};

export const onLocationTextSearch = (search_text, cb) => async (dispatch) => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${search_text}&key=${"AIzaSyA_nmZVriBFLHl4ZdmN7d_WVr9PEH2sZa4"}`
  );
  let newLoc = {};
  if (data.status === "OK") {
    const letVar = data.results[0].address_components;
    letVar.forEach((item) => {
      item.types.forEach((qr) => {
        if (qr === "sublocality") {
          newLoc = { ...newLoc, sub_locality: item.long_name };
        }
        if (qr === "postal_code") {
          newLoc = { ...newLoc, pincode: item.long_name };
        }
        if (qr === "locality") {
          newLoc = { ...newLoc, locality: item.long_name };
        }
        if (qr === "administrative_area_level_2") {
          newLoc = { ...newLoc, city: item.long_name };
        }
        if (qr === "administrative_area_level_1") {
          newLoc = { ...newLoc, state: item.long_name };
        }
      });
    });
    newLoc = {
      ...newLoc,
      coords: data.results[0].geometry.location,
      formatted_address: data.results[0].formatted_address,
    };
    if (cb) cb(newLoc);
  } else {
    Toast("Failed to access location");
    return {};
  }
};

export const getVehicleTypes = () => async (dispatch) => {
  try {
    const { data } = await common_axios.get("/general/vehicle");
    console.log(data);
    if (data.status == "ok") {
      const arr = [];
      data.data.forEach((item) => {
        arr.push({ value: item.id, label: item.name });
      });
      dispatch({ type: VEHICLE_TYPES, data: { data: arr, main: data.data } });
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUser = (setUser) => async (dispatch) => {
  const { data } = await common_axios.get("/user");
  if (data.status == "ok") {
    dispatch(setIsUser(setUser ? false : true));
    dispatch(setUserData(data.data));
  }
};
