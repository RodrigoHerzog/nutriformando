import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  VStack,
  HStack,
  ScrollView,
  Center,
  Heading,
  IconButton,
  useTheme,
  Divider,
} from "native-base";
import { SignOut, CaretLeft } from "phosphor-react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function CreateUserInformation({ navigation, route }) {
  const { colors } = useTheme();
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [userCompleteName, setUserCompleteName] = useState("");
  const [userAge, setUserAge] = useState("");

  function handleUserCompleteName(completeName) {
    completeName = completeName.replace(
      /[^a-zA-ZáÁàÀãÃâÂéÉèÈêÊíÍìÌîÎóÓòÒõÕôÔúÚùÙûÛçÇñÑ\- ]/g,
      ""
    );
    setUserCompleteName(completeName);
  }
  function handleUserAge(age) {
    age = age.replace(/[^0-9]+/g, "");
    setUserAge(age);
  }

  async function handleNewUserInfoCreation() {
    setIsLoading(true);
    console.log(userCompleteName, userAge, user.uid);

    if (!userCompleteName || !userAge || !user.uid) {
      setIsLoading(false);
      return Alert.alert("Informações pessoais", "Preencha todos os campos.");
    }

    firestore()
      .collection("UserInfos")
      .doc(user.uid)
      .set({
        userAge,
        userCompleteName,
        userType: "FreeClient",
        premiumClientInfos: {},
      })
      .then(() => {
        Alert.alert(
          "Informações pessoais",
          "Informações pessoais registradas com sucesso."
        );
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Informações pessoais",
          "Não foi possível registrar as informações pessoais."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={6}
      >
        <IconButton
          icon={<CaretLeft color={colors.gray[200]} size={24} />}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log("User signed out!"))
          }
        />
      </HStack>
      <Divider bgColor={"green.500"} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Informações pessoais
          </Heading>
          <Input
            mt={5}
            placeholder="Nome completo"
            value={userCompleteName}
            onChangeText={(completeName) => {
              handleUserCompleteName(completeName);
            }}
          />
          <Input
            placeholder="Idade"
            mt={5}
            value={userAge}
            onChangeText={(age) => {
              handleUserAge(age);
            }}
            keyboardType="numeric"
          />
        </Center>
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewUserInfoCreation}
      />
    </VStack>
  );
}
