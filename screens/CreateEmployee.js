import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import firebase from "@react-native-firebase/app";
import {
  VStack,
  ScrollView,
  useTheme,
  Center,
  Heading,
  Divider,
  Icon,
  Pressable,
} from "native-base";

import firestore from "@react-native-firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Envelope, Key } from "phosphor-react-native";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { InfoSelect } from "../components/InfoSelect";
import { Loading } from "../components/Loading";

export default function CreateEmployee({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { colors } = useTheme();
  const [secondaryAppState, setSecondaryAppState] = useState(undefined);

  const [cargoType, setCargoType] = useState("");
  const listCargoType = [
    ["Analista de marketing", "Analista de marketing"],
    ["Atendimento ao consumidor", "Atendimento ao consumidor"],
    ["Desenvolvedor", "Desenvolvedor"],
    ["Nutricionista", "Nutricionista"],
  ];

  const [show, setShow] = React.useState(false);
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });
  const [userCompleteName, setUserCompleteName] = useState("");
  const [userAge, setUserAge] = useState("");

  var config = {
    apiKey: "AIzaSyCu5qTcLDqq4PDZNsdz4rev9j8qk5x5j6M",
    authDomain: "nutriformando-2c9ea.firebaseapp.com",
    databaseURL: "https://nutriformando-2c9ea.firebaseio.com",
    projectId: "nutriformando-2c9ea",
    storageBucket: "nutriformando-2c9ea.appspot.com",
    messagingSenderId: "113712084722",
    appId: "1:113712084722:web:eb375ad51401691732826b",
  };
  useEffect(() => {
    setIsPageLoading(true);
    loadSecApp();
  }, []);

  async function loadSecApp() {
    let hasSecondaryApp = false;
    for await (const data of firebase.apps) {
      if (data.name == "Secondary") {
        hasSecondaryApp = true;
      }
    }

    if (hasSecondaryApp) {
      let sec = firebase.app("Secondary");
      setSecondaryAppState(sec);
      setIsPageLoading(false);
      return sec;
    } else {
      let sec = firebase.initializeApp(config, "Secondary");
      setSecondaryAppState(sec);
      setIsPageLoading(false);
      return sec;
    }
  }

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

  async function handleNewEmployeeRegister() {
    setIsLoading(true);

    let passedIncrementInAnalytics = false;
    if (
      value.email === "" ||
      value.password === "" ||
      !userCompleteName ||
      !userAge ||
      !cargoType
    ) {
      setIsLoading(false);
      return Alert.alert("Criação de funcionário", "Preencha todos os campos.");
    }
    console.log(
      value.email,
      value.password,
      userCompleteName,
      userAge,
      cargoType
    );

    let countCollection = cargoType + "Count";

    let secondaryApp = await loadSecApp();

    await firestore()
      .collection("Analytics")
      .doc("EmployeesCount")
      .update({ numberOfDocs: firestore.FieldValue.increment(1) })
      .then(async () => {
        await firestore()
          .collection("Analytics")
          .doc(countCollection)
          .update({ numberOfDocs: firestore.FieldValue.increment(1) })
          .then(() => {
            passedIncrementInAnalytics = true;
          })
          .catch((error) => {
            console.log(error);
            passedIncrementInAnalytics = false;
          });
      })
      .catch((error) => {
        console.log(error);
        passedIncrementInAnalytics = false;
      });

    if (passedIncrementInAnalytics) {
      secondaryApp
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(async (userData) => {
          await firestore()
            .collection("UserInfos")
            .doc(userData.user.uid)
            .set({
              userAge,
              userCompleteName,
              userType: cargoType,
              premiumClientInfos: {},
            })
            .then(() => {
              Alert.alert(
                "Criação de funcionário",
                "Funcionário registrado com sucesso."
              );
              firebase.app("Secondary").delete();
              setIsLoading(false);
              navigation.goBack();
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
              return Alert.alert(
                "Criação de funcionário",
                "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato."
              );
            });
        })
        .catch((error) => {
          let errMsg = "";
          if (error.code === "auth/email-already-in-use") {
            errMsg = "O e-mail informado já está em uso!";
          }

          if (error.code === "auth/invalid-email") {
            errMsg = "Insira um e-mail válido!";
          }

          if (error.code === "auth/weak-password") {
            errMsg = "A senha deve conter no mínimo 6 caracteres!";
          }

          if (errMsg != "") {
            setIsLoading(false);
            return Alert.alert("Criação de funcionário", errMsg);
          } else {
            setIsLoading(false);
            console.error(error);
            errMsg =
              "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
            return Alert.alert("Criação de funcionário", errMsg);
          }
        });
    } else {
      setIsLoading(false);
      console.log(
        "Não foi possível incrementar o número de funcionários na base de dados"
      );
      let errMsg =
        "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
      return Alert.alert("Criação de funcionário", errMsg);
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Novo Funcionário" />
      <Divider bgColor={"green.500"} />
      {isPageLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Divider mb={10} bgColor={"green.500"} />
            <Center flex={1}>
              <Heading color="gray.100" fontSize="xl">
                Informações de login
              </Heading>

              <Input
                mt={5}
                placeholder="E-mail"
                InputLeftElement={
                  <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
                }
                value={value.email}
                onChangeText={(text) => setValue({ ...value, email: text })}
              />

              <Input
                mt={5}
                placeholder="Senha"
                type={show ? "text" : "password"}
                InputLeftElement={
                  <Icon as={<Key color={colors.gray[300]} />} ml={4} />
                }
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
                value={value.password}
                onChangeText={(text) => setValue({ ...value, password: text })}
              />
              <Divider my={10} bgColor={"green.500"} />
              <Heading color="gray.100" fontSize={"xl"} textAlign={"center"}>
                Cargo
              </Heading>
              <InfoSelect
                data={listCargoType}
                mt={5}
                width={"100%"}
                accessibilityLabel="Selecione"
                placeholder="Selecione"
                selectedValue={cargoType}
                onValueChange={(crgType) => {
                  setCargoType(crgType);
                }}
              />
              <Divider my={10} bgColor={"green.500"} />
              <Heading color="gray.100" fontSize={"xl"} textAlign={"center"}>
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
              <Divider mt={10} bgColor={"green.500"} />
            </Center>
          </ScrollView>

          <Button
            title="Cadastrar"
            mt={5}
            isLoading={isLoading}
            onPress={handleNewEmployeeRegister}
          />
        </>
      )}
    </VStack>
  );
}
