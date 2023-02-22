import { useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { useFonts } from "expo-font";
import { useColorScheme } from "nativewind/dist/use-color-scheme";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import { Routes } from "./app/routes/Routes";
import Loading from "./app/components/Loading";

const queryClient = new QueryClient();

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const getTheme = async () => {
      try {
        const value = await AsyncStorage.getItem("@theme");
        if (value !== null) {
          setColorScheme(value === "dark" ? "dark" : "light");
        } else {
          setColorScheme("system");
        }
      } catch {
        setColorScheme("system");
      }
    };

    getTheme();
  }, []);

  const [fontsLoaded] = useFonts({
    RobotoBold: require("./app/assets/fonts/Roboto-Bold.ttf"),
    UnboundedBold: require("./app/assets/fonts/Unbounded-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <View className="flex-1 bg-slate-300 dark:bg-slate-900">
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
        <Toast />
      </View>
    </QueryClientProvider>
  );
}
