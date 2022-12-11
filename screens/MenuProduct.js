import React, { useState, useEffect } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";

import { VStack, ScrollView, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export default function MenuProduct() {
  const navigation = useNavigation();

  const [analytics, setAnalytics] = useState({});
  var tempAnalytics = {};

  useFocusEffect(
    React.useCallback(() => {
      //Below alert will fire every time when profile screen is focused
      loadAnalytics();
    }, [])
  );

  async function loadAnalytics() {
    tempAnalytics = {};
    var data = await firestore().collection("Analytics").get();
    data.forEach((doc) => {
      tempAnalytics[doc.id] = doc.data().numberOfDocs;
      //tempAnalytics = Object.assign(doc.data());
      console.log(doc.id, doc.data());
    });
    setAnalytics(tempAnalytics);
  }

  function handleNewProductCreation() {
    navigation.navigate("Create Product");
  }

  function handleListProducts() {
    navigation.navigate("List Products");
  }

  function handleNewNutriInfoCreation() {
    navigation.navigate("Create NutriInfo");
  }

  function handleListNutriInfo() {
    navigation.navigate("List NutriInfos");
  }

  function handleNewIngredientCreation() {
    navigation.navigate("Create Ingredient");
  }

  function handleListIngredient() {
    navigation.navigate("List Ingredients");
  }

  return (
    <VStack flex={1} px={6} bg="gray.600">
      <Header title="Produtos" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} pb={6} justifyContent={"flex-start"}>
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Produtos
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.ProductsCount == undefined ? (
              <Loading />
            ) : analytics.ProductsCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.ProductsCount == 1 ? (
              analytics.ProductsCount + " cadastro"
            ) : (
              analytics.ProductsCount + " cadastros"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar produto"
            onPress={handleNewProductCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar produtos"
            onPress={handleListProducts}
          />
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Informações Nutricionais
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.NutriInfosCount == undefined ? (
              <Loading />
            ) : analytics.NutriInfosCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.NutriInfosCount == 1 ? (
              analytics.NutriInfosCount + " cadastro"
            ) : (
              analytics.NutriInfosCount + " cadastros"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar informação nutricional"
            onPress={handleNewNutriInfoCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar informações nutricionais"
            onPress={handleListNutriInfo}
          />
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Ingredientes
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.IngredientsCount == undefined ? (
              <Loading />
            ) : analytics.IngredientsCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.IngredientsCount == 1 ? (
              analytics.IngredientsCount + " cadastro"
            ) : (
              analytics.IngredientsCount + " cadastros"
            )}
          </Heading>

          <Button
            marginY={2}
            title="Cadastrar ingrediente"
            onPress={handleNewIngredientCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar ingredientes"
            onPress={handleListIngredient}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
