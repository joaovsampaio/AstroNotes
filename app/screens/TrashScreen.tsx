import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { useMissionList, useUserAccount } from "../store/globalState";
import { deleteDbMissions } from "../database/firebaseDb";
import LottieView from "lottie-react-native";
import colors from "tailwindcss/colors";

import Card from "../components/Card";

const TrashScreen = ({ navigation }: any) => {
  const { missionList, setMissionList } = useMissionList();
  const { userAccount } = useUserAccount();

  const missionTrash = missionList.filter((item) => item.isTrash === true);

  const cleanTrash = () => {
    setMissionList(missionList.filter((item) => item.isTrash === false));
    deleteDbMissions(
      userAccount?.uid,
      missionList.filter((item) => item.isTrash === false)
    );
  };

  const sendToSpace = () => {
    Alert.alert(
      "Limpar Lixeira?",
      "Todas essas missões serão enviadas para o espaço. Essa ação é irreversível!",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            cleanTrash();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-light dark:bg-gray-dark">
      {missionTrash.length === 0 && (
        <View className="items-center justify-center h-full">
          <View className="items-center my-4 p-5 self-center rounded-lg bg-slate-200">
            <Text className="font-medium text-xl uppercase text-red-600">
              Tudo limpo aqui!
            </Text>
          </View>
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 300,
            }}
            source={require("../assets/animations/trash-animation.json")}
          />
        </View>
      )}

      <FlatList
        ListHeaderComponent={
          <>
            <Pressable onPress={sendToSpace} className="items-end mr-10 mt-5">
              <Text className="text-red-500">Limpar Lixeira</Text>
            </Pressable>
            <View className="items-center my-4 w-2/4 self-center rounded-lg bg-slate-200">
              <Text className="font-medium text-xl uppercase text-red-500">
                Lixeira
              </Text>
            </View>
          </>
        }
        data={missionTrash}
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
              bgColor={colors.orange[900]}
              titleColor={colors.slate[200]}
              reportColor={colors.gray[200]}
            />
          );
        }}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default TrashScreen;
