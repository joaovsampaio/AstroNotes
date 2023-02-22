import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Modal from "react-native-modal";

const CustomModal = ({ navigation, route }: any) => {
  const { title, subTitle, func, mode } = route.params;
  const [isModalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    navigation.goBack();
  };

  const restoreMission = () => {
    func();
    navigation.navigate("TrashScreen");
    Toast.show({ type: "success", text1: "Missão Restaurada" });
  };

  const sendMissionToTrash = () => {
    func();
    navigation.navigate("Home");
    Toast.show({ type: "info", text1: "Missão Enviada Para a Lixeira" });
  };
  return (
    <View className="flex-1">
      <Modal isVisible={isModalVisible} onBackdropPress={() => toggleModal()}>
        <View className="flex-1 justify-center">
          <View className="bg-orange-300 items-center p-10 rounded-lg border-2 border-orange-500">
            <Text className="uppercase font-RobotoBold text-xl text-orange-600">
              {title}
            </Text>
            <Text className="font-light text-lg text-orange-600">
              {subTitle}
            </Text>

            <View className="flex-row mt-2">
              <Pressable
                className="mr-10 p-2 rounded-md bg-red-500"
                onPress={toggleModal}
              >
                <Text className="text-white uppercase">Cancelar</Text>
              </Pressable>
              <Pressable
                className="p-2 rounded-md bg-blue-500"
                onPress={
                  mode === "restore" ? restoreMission : sendMissionToTrash
                }
              >
                <Text className="text-white uppercase">Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
