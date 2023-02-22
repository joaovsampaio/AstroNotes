import { View } from "react-native";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-light dark:bg-gray-dark">
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../assets/animations/loading-animation.json")}
      />
    </View>
  );
};

export default Loading;
