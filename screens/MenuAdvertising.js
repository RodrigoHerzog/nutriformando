import React, { useState, useEffect } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";

import { VStack, ScrollView, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export default function MenuAdvertising() {
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

  function handleNewAdvertisingCreation() {
    navigation.navigate("Create Advertising");
  }

  function handleListAdvertising() {
    navigation.navigate("List Advertising");
  }

  return (
    <VStack flex={1} px={6} bg="gray.600">
      <Header title="Anunciantes" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} pb={6} justifyContent={"flex-start"}>
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Anúncios ativos
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.AdvertisingCount == undefined ? (
              <Loading />
            ) : analytics.AdvertisingCount == 0 ? (
              "Nenhum anúncio"
            ) : analytics.AdvertisingCount == 1 ? (
              analytics.AdvertisingCount + " anúncio"
            ) : (
              analytics.AdvertisingCount + " anúncios"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar anúncio"
            onPress={handleNewAdvertisingCreation}
          />
          <Button
            marginY={2}
            title="Listar anúncios"
            onPress={handleListAdvertising}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
