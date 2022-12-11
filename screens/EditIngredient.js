import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { VStack, ScrollView, Center, Heading } from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function EditIngredient({ navigation, route }) {
  const [ingredientName, setIngredientName] = useState("");

  const { ingName, ingID } = route.params;

  const [ingredientsList, setIngredientsList] = useState([]);
  var tempIngredientsList = [];
  var verifyRepeated = false;
  var index = 0;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIngredientName(ingName);
    console.log(ingName, ingID);
    loadIngredientsList();
  }, []);

  async function loadIngredientsList() {
    tempIngredientsList = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngredientsList.push(doc.data().Ingredient);
    });
    setIngredientsList(tempIngredientsList);
  }

  async function handleIngredientEdit() {
    setIsLoading(true);
    if (!ingredientName) {
      setIsLoading(false);
      return Alert.alert("Ingrediente", "Preencha o nome do ingrediente.");
    }
    for (index = 0; index < ingredientsList.length; index++) {
      if (ingredientsList[index] == ingredientName.toLowerCase().trim()) {
        verifyRepeated = true;
      }
    }
    if (verifyRepeated) {
      setIsLoading(false);
      verifyRepeated = false;
      return Alert.alert(
        "Ingrediente",
        "O ingrediente já existe na base de dados."
      );
    }

    const ingRef = firestore().collection("Ingredients").doc(ingID);
    await ingRef
      .update({ Ingredient: ingredientName.toLowerCase().trim() })
      .then(() => {
        Alert.alert("Ingrediente", "Ingrediente editado com sucesso.");
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Ingrediente",
          "Não foi possível editar o ingrediente."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Editar ingrediente
          </Heading>
          <Input
            value={ingredientName}
            mt={5}
            placeholder="Nome do ingrediente"
            onChangeText={setIngredientName}
          />
        </Center>
      </ScrollView>

      <Button
        title="Confirmar"
        mt={5}
        isLoading={isLoading}
        onPress={handleIngredientEdit}
      />
    </VStack>
  );
}
