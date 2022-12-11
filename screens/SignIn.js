import React, { useEffect, useState } from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import Logo from "../assets/NutriFormando_1.svg";
import {
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

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const [show, setShow] = React.useState(false);
  const toast = useToast();

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    {
      value.error
        ? toast.show({
            description: value.error,
          })
        : "";
    } // This is be executed when the state changes}
  }, [value.error]);

  async function signIn() {
    setIsLoading(true);
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

    auth()
      .signInWithEmailAndPassword(value.email, value.password)
      .then(() => {
        console.log("User account signed in!");
      })
      .catch((error) => {
        let errMsg = "";

        if (error.code === "auth/user-not-found" || "auth/wrong-password") {
          errMsg = "E-mail ou senha inválidos!";
        }

        if (errMsg != "") {
          setValue({
            ...value,
            error: errMsg,
          });
        } else {
          /*setValue({
            ...value,
            error: error.message,
          });*/
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
        <VStack alignItems="center">
          <Heading color="gray.100" fontSize="xl" mt={8} mb={6}>
            Acesse sua conta
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
        </VStack>
      </ScrollView>

      <Button
        title="Entrar"
        w="full"
        onPress={signIn}
        isLoading={isLoading}
      ></Button>
    </VStack>
  );
};

export default SignIn;
