import { View, Text, FlatList } from "react-native";
import { useMissionList } from "../store/globalState";
import LottieView from "lottie-react-native";
import Card from "../components/Card";
import colors from "tailwindcss/colors";

const FavoritesScreen = ({ navigation }: any) => {
  const { missionList } = useMissionList();

  const missionFavorites = missionList.filter(
    (item) => item.isFavorite === true
  );

  return (
    <View className="flex-1 bg-gray-light dark:bg-gray-dark">
      {missionFavorites.length === 0 && (
        <View className="items-center justify-center h-full">
          <View className="items-center my-4 p-5 self-center rounded-lg bg-slate-200">
            <Text className="font-medium text-xl uppercase text-blue-900">
              Você ainda não tem favoritos
            </Text>
          </View>
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
            }}
            source={require("../assets/animations/negative-animation.json")}
          />
        </View>
      )}

      <FlatList
        ListHeaderComponent={
          <View className="items-center my-4 w-2/4 self-center rounded-lg bg-slate-200">
            <Text className="font-medium text-xl uppercase text-blue-800">
              Favoritos
            </Text>
          </View>
        }
        data={missionFavorites}
        renderItem={(itemData) => {
          return (
            <Card
              OnPress={() =>
                navigation.navigate("MissionScreen", {
                  mission: itemData.item,
                })
              }
              image={itemData.item.image}
              title={itemData.item.title}
              report={itemData.item.report}
              time={itemData.item.date}
              bgColor={colors.orange[600]}
            />
          );
        }}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default FavoritesScreen;
