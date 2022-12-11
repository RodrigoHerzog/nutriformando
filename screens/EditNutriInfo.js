import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { VStack, ScrollView, Center, Heading } from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function EditNutriInfo({ navigation, route }) {
  const [nutriInfoName, setNutriInfoName] = useState("");

  const { NutInfName, NutInfID } = route.params;

  const [nutriInfoList, setNutriInfoList] = useState([]);
  var tempNutriInfoList = [];
  var verifyRepeated = false;
  var index = 0;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNutriInfoName(NutInfName);
    loadNutriInfoList();
  }, []);

  async function loadNutriInfoList() {
    tempNutriInfoList = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriInfoList.push(doc.data().NutriInfo);
    });
    setNutriInfoList(tempNutriInfoList);
  }

  async function handleNutriInfoEdit() {
    setIsLoading(true);
    if (!nutriInfoName) {
      setIsLoading(false);
      return Alert.alert(
        "Informação Nutricional",
        "Preencha o nome da informação nutricional."
      );
    }
    for (index = 0; index < nutriInfoList.length; index++) {
      if (nutriInfoList[index] == nutriInfoName.toLowerCase().trim()) {
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

    const nutinfRef = firestore().collection("NutriInfos").doc(NutInfID);
    await nutinfRef
      .update({ NutriInfo: nutriInfoName.toLowerCase().trim() })
      .then(() => {
        Alert.alert(
          "Informação Nutricional",
          "Informação nutricional editada com sucesso."
        );
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Informação Nutricional",
          "Não foi possível editar a informação nutricional."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Editar informação nutricional
          </Heading>
          <Input
            value={nutriInfoName}
            mt={5}
            placeholder="Nome da informação nutricional"
            onChangeText={setNutriInfoName}
          />
        </Center>
      </ScrollView>

      <Button
        title="Confirmar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNutriInfoEdit}
      />
    </VStack>
  );
}
