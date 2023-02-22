import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMissionList, useUserAccount } from "../store/globalState";
import { updateDbMission } from "../database/firebaseDb";
import colors from "tailwindcss/colors";

const MissionScreen = ({ route, navigation }: any) => {
  const titleRef = useRef<TextInput>(null);
  const { mission } = route.params;
  const [favorite, setFavorite] = useState(mission.isFavorite);
  const [editTitle, setEditTitle] = useState(mission.title);
  const [editReport, setEditReport] = useState(mission.report);
  const [editImage, setEditImage] = useState(mission.image);
  const [editMode, setEditMode] = useState(false);

  const { missionList, setMissionList } = useMissionList();
  const { userAccount } = useUserAccount();

  const addFavorites = (missionId: string) => {
    const newState = missionList.map((item) => {
      if (item.id === missionId) {
        setFavorite(!item.isFavorite);
        return { ...item, isFavorite: !item.isFavorite };
      }

      return item;
    });

    Toast.show({
      type: !favorite ? "success" : "error",
      text1: !favorite ? "Adicionado Aos Favoritos" : "Removido Dos Favoritos",
    });
    updateDbMission(userAccount?.uid, newState);
    setMissionList(newState);
  };

  const handleDelete = (missionId: string) => {
    const newState = missionList.map((item) => {
      if (item.id === missionId) {
        return {
          ...item,
          isTrash: !item.isTrash,
          isFavorite: false,
        };
      }

      return item;
    });

    updateDbMission(userAccount?.uid, newState);
    setMissionList(newState);
  };

  const sendToTrash = (missionId: string) => {
    navigation.navigate("CustomModal", {
      title: "Enviar Para A Lixeira?",
      subTitle: "A missão será enviada para a lixeira.",
      func: () => handleDelete(missionId),
      mode: "trash",
    });
  };

  const restoreMission = (missionId: string) => {
    navigation.navigate("CustomModal", {
      title: "Restaurar Missão?",
      subTitle: "A Missão Será Restaurada.",
      func: () => handleDelete(missionId),
      mode: "restore",
    });
  };

  const editMission = (missionId: string) => {
    const newState = missionList.map((item) => {
      if (item.id === missionId) {
        return {
          ...item,
          title: editTitle,
          report: editReport,
          image: editImage,
          updatedDate: format(new Date(), "dd/MM/yyyy"),
          updatedHour: format(new Date(), "p", { locale: ptBR }),
        };
      }

      Toast.show({ type: "success", text1: "Editado" });
      return item;
    });

    updateDbMission(userAccount?.uid, newState);
    setMissionList(newState);
  };

  const pickNewImage = async () => {
    if (!editMode) return;

    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      className="bg-gray-light dark:bg-gray-dark flex-1"
      keyboardShouldPersistTaps={"handled"}
    >
      <View className="p-4">
        <Pressable
          className="items-end active:opacity-50"
          onPress={() => addFavorites(mission.id)}
          style={{ display: mission.isTrash === true ? "none" : "flex" }}
        >
          <Ionicons
            name={favorite === true ? "star" : "star-outline"}
            size={24}
            color={colors.yellow[500]}
          />
        </Pressable>
        <View>
          <Pressable onPress={pickNewImage}>
            <Image
              source={{ uri: editImage }}
              style={{
                width: 350,
                height: 250,
                display: mission.image ? "flex" : "none",
              }}
              className="m-4 self-center rounded-md"
            />
          </Pressable>

          <View className="my-3">
            <TextInput
              editable={editMode}
              multiline
              ref={titleRef}
              onEndEditing={() => editMission(mission.id)}
              onChangeText={(enteredTitle: string) =>
                setEditTitle(enteredTitle)
              }
              value={editTitle}
              className="font-UnboundedBold p-1 text-3xl text-center text-orange-500 bg-black mb-4 rounded-lg"
            />
            <TextInput
              editable={editMode}
              multiline
              onEndEditing={() => editMission(mission.id)}
              onChangeText={(enteredReport: string) =>
                setEditReport(enteredReport)
              }
              value={editReport}
              className="font-normal text-lg text-slate-700 dark:text-slate-500 mb-4"
            />
          </View>
        </View>

        <View>
          <View
            className="justify-end flex-row"
            style={{ display: mission.isTrash === true ? "none" : "flex" }}
          >
            <Pressable
              className="mr-5 p-3 bg-red-400 rounded-full active:opacity-50"
              onPress={() => sendToTrash(mission.id)}
            >
              <Ionicons name="trash-bin" size={28} color={colors.red[900]} />
            </Pressable>
            <Pressable
              className="p-3 rounded-full active:opacity-50"
              style={{
                backgroundColor:
                  editMode === false ? colors.orange[400] : colors.green[400],
              }}
              onPressIn={() => setEditMode(!editMode)}
              onPressOut={() => editMode === true && titleRef.current?.focus()}
            >
              <Ionicons
                name={editMode === false ? "pencil" : "checkmark"}
                size={28}
                color={
                  editMode === false ? colors.orange[900] : colors.green[900]
                }
              />
            </Pressable>
          </View>

          <View>
            <Text className="font-medium text-orange-400 mt-1">
              Criado: {mission.date}, {mission.hour}h
            </Text>
            <Text
              className="font-medium text-orange-600"
              style={{
                display: mission.updatedDate ? "flex" : "none",
              }}
            >
              Editado: {mission.updatedDate}, {mission.updatedHour}h
            </Text>
          </View>

          <View
            className="self-center bg-orange-500 rounded-lg p-2 active:opacity-50"
            style={{ display: mission.isTrash === true ? "flex" : "none" }}
          >
            <Pressable onPress={() => restoreMission(mission.id)}>
              <Text className="text-base text-slate-100 uppercase font-medium">
                Restaurar Missão
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MissionScreen;
