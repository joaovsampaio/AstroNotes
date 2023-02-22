import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind/dist/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useUserAccount } from "../store/globalState";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useQuery } from "react-query";
import colors from "tailwindcss/colors";

import Header from "../components/Header";
import Loading from "../components/Loading";
import CustomModal from "../utils/CustomModal";
import Home from "../screens/Home";
import MissionRegister from "../screens/MissionRegister";
import ExtraFeatures from "../screens/ExtraFeatures";
import MissionScreen from "../screens/MissionScreen";
import TrashScreen from "../screens/TrashScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SignUp from "../screens/SignUp";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MissionScreen" component={MissionScreen} />
      <Stack.Screen
        name="CustomModal"
        component={CustomModal}
        options={{ presentation: "containedTransparentModal" }}
      />
    </Stack.Navigator>
  );
}

function ExtraFeaturesScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExtraFeatures" component={ExtraFeatures} />
      <Stack.Screen name="TrashScreen" component={TrashScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="MissionScreen" component={MissionScreen} />
      <Stack.Screen
        name="CustomModal"
        component={CustomModal}
        options={{ presentation: "containedTransparentModal" }}
      />
    </Stack.Navigator>
  );
}

export const Routes = () => {
  const { colorScheme } = useColorScheme();
  const [hasAccount, setHasAccount] = useState(true);
  const { setUserAccount } = useUserAccount();

  const authLogin = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAccount(user);
        setHasAccount(true);
      } else {
        setHasAccount(false);
        setUserAccount(null);
      }
    });
  };

  const { isLoading } = useQuery("user", authLogin);

  if (isLoading) return <Loading />;

  return !hasAccount ? (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <Header />,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor:
            colorScheme === "light" ? colors.slate[300] : colors.slate[900],
        },
      }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  ) : (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <Header />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor:
            colorScheme === "light" ? colors.slate[300] : colors.slate[900],
        },

        tabBarStyle: {
          backgroundColor:
            colorScheme === "light" ? colors.slate[200] : colors.slate[800],
          borderRadius: 50,
          marginBottom: 8,
          width: "80%",
          alignSelf: "center",
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MissionRegister") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "ExtraFeaturesScreen") {
            iconName = focused ? "menu" : "menu-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.orange[500],
        tabBarInactiveTintColor: colors.slate[500],
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Início",
        }}
      />
      <Tab.Screen
        name="MissionRegister"
        component={MissionRegister}
        options={{
          title: "Nova Missão",
        }}
      />
      <Tab.Screen
        name="ExtraFeaturesScreen"
        component={ExtraFeaturesScreen}
        options={{
          title: "Mais",
        }}
      />
    </Tab.Navigator>
  );
};
