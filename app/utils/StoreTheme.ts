import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeName } from "nativewind/dist/style-sheet/color-scheme";

export const storeTheme = async (value: ColorSchemeName, error: void) => {
  try {
    await AsyncStorage.setItem("@theme", value);
  } catch {
    error;
  }
};
