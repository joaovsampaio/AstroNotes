import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "react-query";
import { useMissionList, useUserAccount } from "../store/globalState";
import { getDbMission } from "../database/firebaseDb";
import LottieView from "lottie-react-native";

import Card from "../components/Card";
import Loading from "../components/Loading";

const Home = ({ navigation }: any) => {
  const { missionList, setMissionList } = useMissionList();
  const { userAccount } = useUserAccount();

  const { isLoading } = useQuery(
    "missions",
    () => getDbMission(userAccount?.uid),
    {
      onSuccess: (data) => setMissionList(data || []),
      enabled: !!userAccount?.uid,
    }
  );

  if (isLoading) return <Loading />;

  const homeList = missionList.filter(
    (item) => item.isTrash === false && item.isFavorite === false
  );

  return (
    <View className="flex-1 bg-gray-light dark:bg-gray-dark">
      {homeList.length === 0 && (
        <View className="items-center justify-center h-full">
          <Text className="text-lg font-bold text-orange-600 uppercase px-1">
            "Esse é um pequeno passo para o homem, mas um gigantesco salto para
            a humanidade"
          </Text>
          <Text className="self-start m-1 text-orange-500 font-light text-base">
            - Neil Armstrong
          </Text>
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
            }}
            source={require("../assets/animations/astronaut-animation.json")}
          />

          <Pressable
            className="bg-orange-600 rounded-md p-3 active:opacity-80"
            onPress={() => navigation.jumpTo("MissionRegister")}
          >
            <Text className="text-orange-200">Nova Missão</Text>
          </Pressable>
        </View>
      )}
      <FlatList
        ListHeaderComponent={
          <View className="my-4 ml-10">
            <Text className="font-UnboundedBold text-2xl uppercase text-orange-500">
              Missões
            </Text>
          </View>
        }
        data={homeList.reverse()}
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
              time={`${itemData.item.date} ás ${itemData.item.hour}`}
            />
          );
        }}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default Home;
