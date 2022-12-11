import React, { useState, useEffect } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { VStack, ScrollView, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export default function MenuEmployee() {
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

  function handleListEmployee() {
    navigation.navigate("List Employee");
  }

  function handleNewEmployeeCreation() {
    navigation.navigate("Create Employee");
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Funcionários" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Heading
          color="gray.100"
          fontSize="xl"
          alignSelf={"center"}
          mt={8}
          mb={4}
        >
          {analytics["EmployeesCount"] == undefined ? (
            <Loading mt={8} mb={5} />
          ) : (
            <></>
          )}
          {analytics["EmployeesCount"] == undefined ? (
            <></>
          ) : analytics["EmployeesCount"] == 0 ? (
            "Nenhum funcionário"
          ) : analytics["EmployeesCount"] == 1 ? (
            analytics["EmployeesCount"] + " funcionário"
          ) : (
            analytics["EmployeesCount"] + " funcionários"
          )}
        </Heading>

        {analytics["Analista de marketingCount"] == undefined ? (
          <></>
        ) : analytics["Analista de marketingCount"] == 0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            Nenhum analista de marketing
          </Heading>
        ) : analytics["Analista de marketingCount"] == 1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["Analista de marketingCount"]} Analista de marketing
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
            {analytics["Analista de marketingCount"]} Analistas de marketing
          </Heading>
        )}

        {analytics["Atendimento ao consumidorCount"] == undefined ? (
          <></>
        ) : analytics["Atendimento ao consumidorCount"] == 0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            Nenhum atendente do SAC
          </Heading>
        ) : analytics["Atendimento ao consumidorCount"] == 1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["Atendimento ao consumidorCount"]} Atendente do SAC
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
            {analytics["Atendimento ao consumidorCount"]} Atendentes do SAC
          </Heading>
        )}

        {analytics["DesenvolvedorCount"] == undefined ? (
          <></>
        ) : analytics["DesenvolvedorCount"] == 0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            Nenhum desenvolvedor
          </Heading>
        ) : analytics["DesenvolvedorCount"] == 1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
            mb={1}
          >
            {analytics["DesenvolvedorCount"]} Desenvolvedor
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
            {analytics["DesenvolvedorCount"]} Desenvolvedores
          </Heading>
        )}

        {analytics["NutricionistaCount"] == undefined ? (
          <></>
        ) : analytics["NutricionistaCount"] == 0 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
          >
            Nenhum nutricionista
          </Heading>
        ) : analytics["NutricionistaCount"] == 1 ? (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
          >
            {analytics["NutricionistaCount"]} Nutricionista
          </Heading>
        ) : (
          <Heading
            color="gray.200"
            fontSize="sm"
            textAlign={"left"}
            alignSelf={"flex-start"}
            ml={2}
          >
            {analytics["NutricionistaCount"]} Nutricionistas
          </Heading>
        )}

        <VStack flex={1} pt={4} pb={2} justifyContent={"flex-start"}>
          <Button
            marginY={2}
            title="Cadastrar Novo Funcionário"
            onPress={handleNewEmployeeCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar Funcionários"
            onPress={handleListEmployee}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
