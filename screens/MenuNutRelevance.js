import React, { useState, useEffect } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";

import { VStack, ScrollView, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export default function MenuNutRelevance() {
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

  function handleNewGeneralNutRelevanceCreation() {
    navigation.navigate("Create NutRelevance", { tipo: "general" });
  }

  function handleListGeneralNutRelevance() {
    navigation.navigate("List NutRelevance", { tipo: "general" });
  }

  function handleNewSpecificNutRelevanceCreation() {
    navigation.navigate("Create NutRelevance", { tipo: "specific" });
  }

  function handleListSpecificNutRelevance() {
    navigation.navigate("List NutRelevance", { tipo: "specific" });
  }

  return (
    <VStack flex={1} px={6} bg="gray.600">
      <Header title="Relevância Nutricional" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} pb={6} justifyContent={"flex-start"}>
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Relevâncias Gerais
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.GeneralRelevanceCount == undefined ? (
              <Loading />
            ) : analytics.GeneralRelevanceCount == 0 ? (
              "Nenhuma informação"
            ) : analytics.GeneralRelevanceCount == 1 ? (
              analytics.GeneralRelevanceCount + " informação"
            ) : (
              analytics.GeneralRelevanceCount + " informações"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar informação geral"
            onPress={handleNewGeneralNutRelevanceCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar informações gerais"
            onPress={handleListGeneralNutRelevance}
          />
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Relevâncias Específicas
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.SpecificRelevanceCount == undefined ? (
              <Loading />
            ) : analytics.SpecificRelevanceCount == 0 ? (
              "Nenhuma informação"
            ) : analytics.SpecificRelevanceCount == 1 ? (
              analytics.SpecificRelevanceCount + " informação"
            ) : (
              analytics.SpecificRelevanceCount + " informações"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar informação específica"
            onPress={handleNewSpecificNutRelevanceCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar informações específicas"
            onPress={handleListSpecificNutRelevance}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
