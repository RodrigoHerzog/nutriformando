import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { VStack, ScrollView, Center, Heading } from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function CreateIngredient({ navigation }) {
  const [ingredientName, setIngredientName] = useState("");

  const [ingredientsList, setIngredientsList] = useState([]);
  var tempIngredientsList = [];
  var verifyRepeated = false;
  var index = 0;
  var passedIncrementInAnalytics = false;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    tempIngredientsList = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngredientsList.push(doc.data().Ingredient);
    });
    setIngredientsList(tempIngredientsList);
  }

  async function handleNewIngredientRegister() {
    setIsLoading(true);
    if (!ingredientName) {
      setIsLoading(false);
      return Alert.alert(
        "Ingrediente",
        "Preencha o nome do ingrediente a ser adicionado."
      );
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

    await firestore()
      .collection("Analytics")
      .doc("IngredientsCount")
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
        .collection("Ingredients")
        .add({
          Ingredient: ingredientName.toLowerCase().trim(),
        })
        .then(() => {
          Alert.alert("Ingrediente", "Ingrediente registrado com sucesso.");
          setIsLoading(false);
          setIngredientName("");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Ingrediente",
            "Não foi possível registrar o ingrediente."
          );
        });
    } else {
      setIsLoading(false);
      return Alert.alert(
        "Ingrediente",
        "Não foi possível registrar o ingrediente."
      );
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Novo ingrediente
          </Heading>
          <Input
            mt={5}
            placeholder="Nome do ingrediente"
            onChangeText={setIngredientName}
          />
        </Center>
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewIngredientRegister}
      />
    </VStack>
  );
}
