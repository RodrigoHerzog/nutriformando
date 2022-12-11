import React, { useState, useEffect } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { VStack, ScrollView, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export default function MenuClient() {
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
    console.log(tempAnalytics);
    setAnalytics(tempAnalytics);
  }

  function handleListClient() {
    navigation.navigate("List Client");
  }

  function handleNewClientCreation() {
    navigation.navigate("Create Client");
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Clientes" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Heading
          color="gray.100"
          fontSize="xl"
          alignSelf={"center"}
          mt={8}
          mb={4}
        >
          {analytics["ClientsCount"] == undefined ? (
            <Loading mt={8} mb={5} />
          ) : (
            <></>
          )}
          {analytics["ClientsCount"] == undefined ? (
            <></>
          ) : analytics["ClientsCount"] == 0 ? (
            "Nenhum cliente"
          ) : analytics["ClientsCount"] == 1 ? (
            analytics["ClientsCount"] + " cliente"
          ) : (
            analytics["ClientsCount"] + " clientes"
          )}
        </Heading>

        {analytics["ClientsCount"] == undefined ? (
          <></>
        ) : analytics["ClientsCount"] - analytics["PremiumClientsCount"] <=
          0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            Nenhum cliente gratuito
          </Heading>
        ) : analytics["ClientsCount"] - analytics["PremiumClientsCount"] ==
          1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["ClientsCount"] - analytics["PremiumClientsCount"]}{" "}
            cliente gratuito
          </Heading>
        ) : (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["ClientsCount"] - analytics["PremiumClientsCount"]}{" "}
            clientes gratuitos
          </Heading>
        )}

        {analytics["PremiumClientsCount"] == undefined ? (
          <></>
        ) : analytics["PremiumClientsCount"] == 0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            Nenhum cliente premium
          </Heading>
        ) : analytics["PremiumClientsCount"] == 1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["PremiumClientsCount"]} cliente premium
          </Heading>
        ) : (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["PremiumClientsCount"]} clientes premium
          </Heading>
        )}

        <VStack flex={1} pt={4} pb={2} justifyContent={"flex-start"}>
          <Button
            marginY={2}
            title="Cadastrar Novo Cliente"
            onPress={handleNewClientCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar Clientes"
            onPress={handleListClient}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
