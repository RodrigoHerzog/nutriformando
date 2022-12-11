import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  VStack,
  ScrollView,
  useTheme,
  Center,
  Heading,
  Divider,
} from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function CreateNutriInfo({ navigation }) {
  const [nutriInfosName, setNutriInfosName] = useState("");

  const [nutriInfosList, setNutriInfosList] = useState([]);
  var tempNutriInfosList = [];
  var verifyRepeated = false;
  var index = 0;
  var passedIncrementInAnalytics = false;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNutriInfos();
  }, []);

  async function loadNutriInfos() {
    tempNutriInfosList = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriInfosList.push(doc.data().NutriInfo);
    });
    setNutriInfosList(tempNutriInfosList);
  }

  async function handleNewNutriInfoRegister() {
    setIsLoading(true);
    if (!nutriInfosName) {
      setIsLoading(false);
      return Alert.alert(
        "Informação Nutricional",
        "Preencha o nome da informação nutricional a ser adicionada."
      );
    }
    for (index = 0; index < nutriInfosList.length; index++) {
      if (nutriInfosList[index] == nutriInfosName.toLowerCase().trim()) {
        verifyRepeated = true;
      }
    }
    if (verifyRepeated) {
      setIsLoading(false);
      verifyRepeated = false;
      return Alert.alert(
        "Informação Nutricional",
        "A informação nutricional já existe na base de dados."
      );
    }

    await firestore()
      .collection("Analytics")
      .doc("NutriInfosCount")
      .update({ numberOfDocs: firestore.FieldValue.increment(1) })
      .then(() => {
        passedIncrementInAnalytics = true;
      })
      .catch((error) => {
        console.log(error);
        passedIncrementInAnalytics = false;
      });

    if (passedIncrementInAnalytics) {
      await firestore()
        .collection("NutriInfos")
        .add({
          NutriInfo: nutriInfosName.toLowerCase().trim(),
        })
        .then(() => {
          Alert.alert(
            "Informação Nutricional",
            "Informação nutricional registrada com sucesso."
          );
          setIsLoading(false);
          setNutriInfosName("");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Informação Nutricional",
            "Não foi possível registrar a informação nutricional."
          );
        });
    } else {
      setIsLoading(false);
      return Alert.alert(
        "Informação Nutricional",
        "Não foi possível registrar a informação nutricional."
      );
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header />
      <Divider bgColor={"green.500"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Nova informação nutricional
          </Heading>
          <Input
            mt={5}
            placeholder="Nome da informação nutricional"
            onChangeText={setNutriInfosName}
          />
        </Center>
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewNutriInfoRegister}
      />
    </VStack>
  );
}
