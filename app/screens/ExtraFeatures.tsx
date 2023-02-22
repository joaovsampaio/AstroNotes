import { useEffect } from "react";
import { View, Switch, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useUserAccount } from "../store/globalState";
import { LinearGradient } from "expo-linear-gradient";
import { storeTheme } from "../utils/StoreTheme";
import LottieView from "lottie-react-native";
import colors from "tailwindcss/colors";

import SignOut from "../components/SignOut";

const ExtraFeatures = ({ navigation }: any) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const { userAccount } = useUserAccount();

  useEffect(() => {
    storeTheme(colorScheme, setColorScheme(colorScheme));
  }, [colorScheme]);

  return (
    <View className="flex-1 p-5 bg-gray-light dark:bg-gray-dark">
      <LinearGradient
        colors={[colors.pink[600], colors.pink[700], colors.pink[800]]}
        start={[0.1, 0.6]}
        style={{
          marginBottom: 10,
          borderRadius: 6,
          display: userAccount?.uid !== undefined ? "flex" : "none",
        }}
      >
        <View className="h-40 justify-center">
          <Text className="font-UnboundedBold uppercase text-lg text-center text-white mb-4 px-1">
            "Para o Benefício de Todos"
          </Text>
          <Text className="text-lg ml-2">
            <Text className="text-slate-800 font-semibold">Astronauta: </Text>
            <Text className="text-white font-UnboundedBold">
              {userAccount?.displayName}
            </Text>
          </Text>
        </View>
      </LinearGradient>

      <View className="flex-row justify-between">
        <Pressable
          className="rounded-lg bg-slate-200 dark:bg-slate-800 p-5 items-center active:opacity-75"
          onPress={() => navigation.navigate("FavoritesScreen")}
        >
          <LottieView
            autoPlay
            style={{
              width: 100,
              height: 100,
            }}
            source={require("../assets/animations/astronaut-star-animation.json")}
          />
          <Text className="font-RobotoBold uppercase text-yellow-500">
            Favoritos
          </Text>
        </Pressable>
        <Pressable
          className="rounded-lg bg-slate-200 dark:bg-slate-800 p-5 items-center active:opacity-75"
          onPress={() => navigation.navigate("TrashScreen")}
        >
          <LottieView
            autoPlay
            style={{
              width: 100,
              height: 100,
            }}
            source={require("../assets/animations/trash-animation.json")}
          />
          <Text className="font-RobotoBold uppercase text-red-600">
            Lixeira
          </Text>
        </Pressable>
      </View>
      <View className="flex-row items-center">
        <Text className="dark:text-white pr-2 text-base">Tema:</Text>
        <Ionicons
          name={colorScheme === "light" ? "moon-outline" : "moon"}
          size={24}
          color={colors.orange[400]}
        />
        <Switch
          trackColor={{ true: colors.slate[900], false: colors.slate[200] }}
          thumbColor={colors.orange[500]}
          onValueChange={toggleColorScheme}
          value={colorScheme === "light"}
        />
        <Ionicons
          name={colorScheme === "light" ? "sunny" : "sunny-outline"}
          size={24}
          color={colors.orange[400]}
        />
      </View>
      <View
        style={{ display: userAccount?.uid !== undefined ? "flex" : "none" }}
      >
        <SignOut />
      </View>
    </View>
  );
};

export default ExtraFeatures;
