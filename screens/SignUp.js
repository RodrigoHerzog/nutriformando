import React, { useEffect, useState } from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Logo from "../assets/NutriFormando_1.svg";
import {
  Text,
  VStack,
  IconButton,
  useTheme,
  Icon,
  Pressable,
  useToast,
  Heading,
  HStack,
  Box,
  ScrollView,
  Center,
} from "native-base";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { CaretLeft, Envelope, Key } from "phosphor-react-native";

const SignUp = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const [show, setShow] = React.useState(false);
  const toast = useToast();

  useEffect(() => {
    {
      value.error
        ? toast.show({
            description: value.error,
          })
        : "";
    } // This is be executed when the state changes}
  }, [value.error]);

  async function signUp() {
    setIsLoading(true);
    let passedIncrementInAnalytics = false;
    await setValue({
      ...value,
      error: "",
    });
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Preencha todos os campos!",
      });
      setIsLoading(false);
      return;
    }

    await firestore()
      .collection("Analytics")
      .doc("ClientsCount")
      .update({ numberOfDocs: firestore.FieldValue.increment(1) })
      .then(() => {
        passedIncrementInAnalytics = true;
      })
      .catch((error) => {
        console.log(error);
        passedIncrementInAnalytics = false;
      });

    if (passedIncrementInAnalytics) {
      auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(() => {
          console.log("User account created & signed in!");
          navigation.navigate("Sign In");
        })
        .catch((error) => {
          let errMsg = "";
          if (error.code === "auth/email-already-in-use") {
            errMsg = "O e-mail informado já está em uso!";
          }

          if (error.code === "auth/invalid-email") {
            errMsg = "Insira um e-mail válido!";
          }

          if (error.code === "auth/weak-password") {
            errMsg = "A senha deve conter no mínimo 6 caracteres!";
          }

          if (errMsg != "") {
            setValue({
              ...value,
              error: errMsg,
            });
          } else {
            errMsg =
              "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
            setValue({
              ...value,
              error: errMsg,
            });
            console.error(error);
          }
          setIsLoading(false);
        });
    } else {
      let errMsg =
        "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
      setValue({
        ...value,
        error: errMsg,
      });
      console.log(
        "Não foi possível incrementar o número de clientes na base de dados"
      );
    }
    setIsLoading(false);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  const { colors } = useTheme();
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pb={6} pt={24}>
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <IconButton
          icon={<CaretLeft color={colors.gray[200]} size={24} />}
          onPress={handleGoBack}
        />
        <Box flex={1} ml={6}>
          <Logo />
        </Box>
      </HStack>
      <ScrollView w={"full"} contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1} w={"full"}>
          <Heading color="gray.100" fontSize="xl" mt={8} mb={6}>
            Vamos criar uma conta
          </Heading>

          <Input
            mb={4}
            placeholder="E-mail"
            InputLeftElement={
              <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
            }
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text })}
          />

          <Input
            mb={8}
            placeholder="Senha"
            type={show ? "text" : "password"}
            InputLeftElement={
              <Icon as={<Key color={colors.gray[300]} />} ml={4} />
            }
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            value={value.password}
            onChangeText={(text) => setValue({ ...value, password: text })}
          />
        </Center>
      </ScrollView>

      <Button
        mt={5}
        title="Cadastrar"
        w="full"
        onPress={signUp}
        isLoading={isLoading}
      ></Button>
    </VStack>
  );
};

export default SignUp;
