import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Formik, ErrorMessage } from "formik";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useUserAccount } from "../store/globalState";
import { styled } from "nativewind";
import colors from "tailwindcss/colors";
import * as Yup from "yup";

import Loading from "../components/Loading";

const StyledGradient = styled(LinearGradient);

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Muito Curto")
    .max(15, "Muito Longo")
    .required("Necessário"),
  email: Yup.string()
    .email("Email Inválido")
    .required("O Campo Deve Ser Preenchido"),
  password: Yup.string()
    .min(6, "É Necessário ao menos 6 caracteres")
    .required("O Campo Deve Ser Preenchido"),
});

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email Inválido")
    .required("O Campo Deve Ser Preenchido"),
  password: Yup.string()
    .min(6, "É Necessário ao menos 6 caracteres")
    .required("O Campo Deve Ser Preenchido"),
});

const SignUp = () => {
  const { colorScheme } = useColorScheme();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUserAccount } = useUserAccount();

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setLoading(true);
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(response.user, {
        displayName: name,
      });
      setUserAccount(response.user);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: `Bem Vindo, ${response.user.displayName}!`,
      });
    } catch {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Não Foi Possível Criar Uma Conta",
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUserAccount(response.user);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: `Bem Vindo, ${response.user.displayName}!`,
      });
    } catch {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Não Foi Possível Fazer Login",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <StyledGradient
      className="items-center justify-center flex-1"
      colors={
        colorScheme === "light"
          ? [colors.slate[300], colors.slate[400]]
          : [colors.slate[900], colors.slate[800]]
      }
      start={[0.5, 0.6]}
    >
      <Text className="my-3 p-1 uppercase text-xl text-slate-600">
        {isSignUp ? "Criar Conta" : "Entrar"}
      </Text>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validationSchema={isSignUp ? SignUpSchema : SignInSchema}
        onSubmit={(values) =>
          isSignUp === true
            ? handleSignUp(values.email, values.password, values.name)
            : handleSignIn(values.email, values.password)
        }
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <View style={{ display: isSignUp ? "flex" : "none" }}>
              <Text className="mb-1 text-slate-500">Nome:</Text>
              <TextInput
                placeholder="nome"
                placeholderTextColor={colors.slate[300]}
                className="w-80 h-10 p-2
                  border rounded-md border-slate-500 
                  text-base dark:text-white
                  bg-slate-100 dark:bg-slate-600"
                onChangeText={handleChange("name")}
                value={values.name}
              />
              <Text className="mb-5 font-RobotoBold">
                <ErrorMessage name="name" />
              </Text>
            </View>

            <Text className="mb-1 text-slate-500">Email:</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="nome@email.com"
              placeholderTextColor={colors.slate[300]}
              className="w-80 h-10 p-2
                  border rounded-md border-slate-500 
                  text-base dark:text-white
                  bg-slate-100 dark:bg-slate-600"
              onChangeText={handleChange("email")}
              value={values.email}
            />
            <Text className="mb-5 font-RobotoBold">
              <ErrorMessage name="email" />
            </Text>

            <Text className="mb-1 text-slate-500">Senha:</Text>
            <TextInput
              placeholder="6 caracteres no minímo"
              placeholderTextColor={colors.slate[300]}
              secureTextEntry={true}
              className="w-80 h-10 p-2
                  border rounded-md border-slate-500 
                  text-base dark:text-white
                  bg-slate-100 dark:bg-slate-600"
              onChangeText={handleChange("password")}
              value={values.password}
            />
            <Text className="mb-5 font-RobotoBold">
              <ErrorMessage name="password" />
            </Text>

            <Pressable
              onPress={() => handleSubmit()}
              className="border border-slate-500 rounded-full p-2 mb-2 items-center active:opacity-50"
            >
              <Text className="uppercase font-RobotoBold text-slate-500">
                {isSignUp ? "Registrar" : "Entrar"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setIsSignUp(!isSignUp)}
              className="my-3 items-center"
            >
              <Text className="uppercase text-slate-500 underline">
                {isSignUp ? "Já Tenho Uma Conta" : "Criar Conta"}
              </Text>
            </Pressable>
          </View>
        )}
      </Formik>
      <Text className="my-3 p-2 uppercase font-light text-center text-slate-500">
        {isSignUp
          ? "Crie Uma Conta Para Os Seus Dados Não Irem Para O Espaço!"
          : "Faça Login Para Recuperar Suas Missões!"}
      </Text>
    </StyledGradient>
  );
};

export default SignUp;
