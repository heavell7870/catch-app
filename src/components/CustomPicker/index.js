import React from "react";
import { StyleSheet, Platform, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GlobalStyles } from "../../utils/globalStyles";
import RNPickerSelect from "react-native-picker-select";

function CustomPicker({ items, setValue, placeholder, val, style, data }) {
  if (Platform.OS == "android") {
    return (
      <View style={{ ...GlobalStyles.input_container, ...style }}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          placeholder={placeholder}
          Icon={() => (
            <FontAwesome
              style={{ marginTop: 10, marginRight: 10 }}
              color="#72757C"
              size={25}
              name="caret-down"
            />
          )}
          value={val}
          style={pickerSelectStyles}
          onValueChange={(value) => setValue(value)}
          items={data}
        />
      </View>
    );
  }
  return (
    <RNPickerSelect
      value={val}
      placeholder={placeholder}
      Icon={() => (
        <FontAwesome
          style={{ marginTop: 25, marginRight: 10 }}
          color="#72757C"
          size={25}
          name="caret-down"
        />
      )}
      style={pickerSelectStyles}
      onValueChange={(value) => setValue(value)}
      items={data}
    />
  );
}

export default CustomPicker;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 45,
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
    fontSize: 12,
    ...GlobalStyles.regular_text,
  },
  inputAndroid: {
    fontSize: 16,
    paddingTop: 5,
    height: 45,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    fontSize: 12,
    ...GlobalStyles.regular_text,
  },
  placeholder: {
    color: "rgba(0,0,0,0.4)",
  },
});
