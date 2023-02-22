import { useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  Pressable,
  Image,
} from "react-native";
import {
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { useMissionList, useUserAccount } from "../store/globalState";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { createDbMission } from "../database/firebaseDb";

export type MissionType = {
  id: string;
  title: string;
  report: string;
  image: string | null;
  date: string;
  hour: string;
  updatedDate: string | null;
  updatedHour: string | null;
  isFavorite: boolean;
  isTrash: boolean;
};

const MissionRegister = () => {
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [report, setReport] = useState("");

  const { missionList, setMissionList } = useMissionList();
  const { userAccount } = useUserAccount();

  const missionOBJ: MissionType = {
    id: uuidv4(),
    title: title === "" ? "Nova Missão" : title,
    report: report === "" ? "Relatório" : report,
    image: image,
    date: format(new Date(), "dd/MM/yyyy"),
    hour: format(new Date(), "p", { locale: ptBR }),
    updatedDate: null,
    updatedHour: null,
    isFavorite: false,
    isTrash: false,
  };

  const verifyPermissions = async () => {
    if (
      cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED ||
      PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
  };

  const pickImage = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onFormPress = async () => {
    setMissionList([...missionList, { ...missionOBJ }]);

    await createDbMission(userAccount?.uid, [
      ...missionList,
      { ...missionOBJ },
    ]);

    setTitle("");
    setReport("");
    setImage(null);
    Toast.show({ type: "success", text1: "Missão Criada!" });
  };

  return (
    <ScrollView
      className="bg-gray-light dark:bg-gray-dark"
      keyboardShouldPersistTaps={"handled"}
    >
      <View className="h-full items-center pb-8">
        <Text className="text-orange-500 text-lg">Título</Text>
        <TextInput
          className="w-10/12 h-10 mb-8 p-2 text-base border border-orange-200 bg-slate-100 dark:bg-slate-300"
          onChangeText={(enteredTitle: any) => setTitle(enteredTitle)}
          value={title}
        />

        <Text className="text-orange-500 text-lg">Relatório</Text>
        <TextInput
          className="w-10/12 h-96 justify-start text-base border border-orange-200 p-2 bg-slate-100 dark:bg-slate-300"
          style={{ textAlignVertical: "top" }}
          underlineColorAndroid="transparent"
          numberOfLines={10}
          multiline={true}
          onChangeText={(enteredReport: any) => setReport(enteredReport)}
          value={report}
        />

        <Text className="text-orange-500 text-lg">Imagem</Text>
        <Pressable className="my-3 active:opacity-50" onPress={pickImage}>
          <Text className="text-orange-400 text-base underline mr-1">
            Escolher Imagem
          </Text>
        </Pressable>
        <Image
          source={image !== null ? { uri: image } : undefined}
          style={{
            width: 350,
            height: 250,
            display: image === null ? "none" : "flex",
          }}
        />

        <Pressable
          className="flex-row items-center bg-orange-600 rounded-xl p-3 mt-3 active:opacity-50"
          onPress={onFormPress}
        >
          <Text className="text-white pr-3">Nova Missão</Text>
          <Ionicons name="rocket" size={24} color="white" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default MissionRegister;
