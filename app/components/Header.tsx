import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View>
      <Text className="text-3xl text-orange-500 font-RobotoBold">
        Astro
        <Text className="text-orange-700">
          N
          <Ionicons name="planet" size={24} />
          tes
        </Text>
      </Text>
    </View>
  );
};

export default Header;
