import { View, Text, Pressable, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useUserAccount } from "../store/globalState";
import { styled } from "nativewind";
import { deleteAllDbMissions } from "../database/firebaseDb";
import colors from "tailwindcss/colors";

const StyledGradient = styled(LinearGradient);

const SignOut = () => {
  const { userAccount, setUserAccount } = useUserAccount();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUserAccount(null);
        Toast.show({
          type: "info",
          text1: "Você Saiu Da Sua Conta",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Não Foi Possível Fazer Sair Da Sua Conta",
        });
      });
  };

  const alertSignOut = () => {
    Alert.alert("Sair Da Conta?", "Você sairá da sua conta.", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          handleSignOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    deleteAllDbMissions(userAccount?.uid);
    user
      ?.delete()
      .then(() => {
        setUserAccount(null);
        Toast.show({
          type: "info",
          text1: "Conta Apagada",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Não Foi Possível Apagar A Sua Conta, Tente Novamente.",
        });
      });
  };

  const alertDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta?",
      "Sua Conta Será Deletada, Assim Como Todas As Missões. Essa Ação É Irreversível!",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            handleDeleteAccount();
          },
        },
      ]
    );
  };

  return (
    <View className="mb-3">
      <StyledGradient
        className="items-center rounded"
        colors={[colors.red[500], colors.red[600]]}
        start={[0.1, 0.6]}
      >
        <Pressable
          onPress={() => alertSignOut()}
          className="my-3 items-center w-full active:opacity-50"
        >
          <Text className="uppercase text-white">Sair</Text>
        </Pressable>
        <Pressable
          onPress={() => alertDeleteAccount()}
          className="my-3 items-center w-full active:opacity-50"
        >
          <Text className="uppercase text-white">Excluir Conta</Text>
        </Pressable>
      </StyledGradient>
    </View>
  );
};

export default SignOut;
