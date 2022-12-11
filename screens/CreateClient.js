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
  Switch,
  HStack,
  IconButton,
  Text,
  Box,
} from "native-base";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Envelope, Key, Plus, Minus } from "phosphor-react-native";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { InfoSelect } from "../components/InfoSelect";
import { Loading } from "../components/Loading";

export default function CreateClient({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { colors } = useTheme();
  const [secondaryAppState, setSecondaryAppState] = useState(undefined);

  const user = auth().currentUser;

  const [nutRelInfos, setNutRelInfos] = useState([]);
  const [nutritionalRelevanceInfos, setNutritionalRelevanceInfos] = useState(
    []
  );
  const [nutRelNameToAdd, setNutRelNameToAdd] = useState("");
  const [nutRelKeyToAdd, setNutRelKeyToAdd] = useState("");

  const [ingInfos, setIngInfos] = useState([]);
  const [ingredientInfos, setIngredientInfos] = useState([]);
  const [ingNameToAdd, setIngNameToAdd] = useState("");
  const [ingKeyToAdd, setIngKeyToAdd] = useState("");

  var tempNutRelItems,
    tempIngItems = [];
  var passedIncrementInAnalytics = false;

  let CadIngredientInfos,
    CadNutritionalRelevanceInfos = {};

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
  const [userPremium, setUserPremium] = useState(false);

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
    loadNutRelevanceItems();
    loadIngItems();
    loadSecApp();
  }, []);

  async function loadNutRelevanceItems() {
    tempNutRelItems = [];
    var data = await firestore().collection("NutRelevance").get();
    data.forEach((doc) => {
      if (doc.data().ConditionRelevant != "") {
        tempNutRelItems.push([doc.data().ConditionRelevant, doc.id]);
      }
    });
    setNutRelInfos(tempNutRelItems);
  }

  async function loadIngItems() {
    tempIngItems = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngItems.push([doc.data().Ingredient, doc.id]);
    });
    setIngInfos(tempIngItems);
  }

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
      !userAge
    ) {
      setIsLoading(false);
      return Alert.alert("Criação de cliente", "Preencha todos os campos.");
    }
    if (nutritionalRelevanceInfos == [] && ingredientInfos == []) {
      setIsLoading(false);
      return Alert.alert(
        "Criação de cliente",
        "Adicione alguma informação relevante premium."
      );
    }

    CadIngredientInfos = Object.fromEntries(
      ingredientInfos.map((ing) => [
        ing[2],
        {
          name: ing[0],
          id: ing[1],
        },
      ])
    );

    CadNutritionalRelevanceInfos = Object.fromEntries(
      nutritionalRelevanceInfos.map((nutrel) => [
        nutrel[2],
        {
          name: nutrel[0],
          id: nutrel[1],
        },
      ])
    );

    let secondaryApp = await loadSecApp();

    await firestore()
      .collection("Analytics")
      .doc("ClientsCount")
      .update({ numberOfDocs: firestore.FieldValue.increment(1) })
      .then(async () => {
        if (userPremium) {
          await firestore()
            .collection("Analytics")
            .doc("PremiumClientsCount")
            .update({ numberOfDocs: firestore.FieldValue.increment(1) })
            .then(() => {
              passedIncrementInAnalytics = true;
            })
            .catch((error) => {
              console.log(error);
              passedIncrementInAnalytics = false;
            });
        } else {
          passedIncrementInAnalytics = true;
        }
      })
      .catch((error) => {
        console.log(error);
        passedIncrementInAnalytics = false;
      });

    if (passedIncrementInAnalytics) {
      if (userPremium) {
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
                userType: "PremiumClient",
                premiumClientInfos: {
                  IngredientsRelevance: CadIngredientInfos,
                  NutritionalRelevance: CadNutritionalRelevanceInfos,
                },
              })
              .then(() => {
                Alert.alert(
                  "Criação de cliente",
                  "Cliente registrado com sucesso."
                );
                firebase.app("Secondary").delete();
                setIsLoading(false);
                navigation.goBack();
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
                return Alert.alert(
                  "Criação de cliente",
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
              return Alert.alert("Criação de cliente", errMsg);
            } else {
              setIsLoading(false);
              console.error(error);
              errMsg =
                "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
              return Alert.alert("Criação de cliente", errMsg);
            }
          });
      } else {
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
                userType: "FreeClient",
                premiumClientInfos: {},
              })
              .then(() => {
                Alert.alert(
                  "Criação de cliente",
                  "Cliente registrado com sucesso."
                );
                firebase.app("Secondary").delete();
                setIsLoading(false);
                navigation.goBack();
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
                return Alert.alert(
                  "Criação de cliente",
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
              return Alert.alert("Criação de cliente", errMsg);
            } else {
              setIsLoading(false);
              console.error(error);
              errMsg =
                "Não conseguimos comunicação com o servidor, tente novamente mais tarde ou entre em contato.";
              return Alert.alert("Criação de cliente", errMsg);
            }
          });
      }
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
      <Header title="Novo Cliente" />
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
              <Divider my={10} bgColor={"green.500"} />
              <HStack
                mx={5}
                space={3}
                alignItems="center"
                justifyContent="center"
              >
                <Heading
                  color="gray.100"
                  fontSize={"xl"}
                  flex={0.8}
                  textAlign={"left"}
                >
                  Client Premium
                </Heading>
                <Switch
                  size="lg"
                  onTrackColor="green.700"
                  value={userPremium}
                  onToggle={setUserPremium}
                  flex={0.2}
                />
              </HStack>

              {userPremium ? (
                <>
                  <Divider my={10} bgColor={"green.500"} />
                  <Heading
                    color="gray.100"
                    fontSize={"2xl"}
                    textAlign={"center"}
                  >
                    Informações relevantes
                  </Heading>
                  <Divider my={10} bgColor={"green.500"} />
                  <Heading
                    color="gray.100"
                    fontSize={"xl"}
                    ml={2}
                    mb={3}
                    alignSelf={"center"}
                    textAlign={"left"}
                  >
                    Alergias / Intolerâncias:
                  </Heading>
                  <HStack alignContent={"center"}>
                    <InfoSelect
                      data={ingInfos}
                      flex={1}
                      m={2}
                      key={ingKeyToAdd}
                      w={"100%"}
                      accessibilityLabel="Selecione"
                      selectedValue={ingKeyToAdd}
                      placeholder={"Selecione"}
                      onValueChange={(itemValue) => {
                        setIngKeyToAdd(itemValue);
                        for (var x = 0; x < ingInfos.length; x++) {
                          if (ingInfos[x][1] == itemValue) {
                            setIngNameToAdd(ingInfos[x][0]);
                          }
                        }
                      }}
                    />
                    <IconButton
                      icon={
                        <Icon
                          as={<Plus color={colors.gray[100]} />}
                          name="adicionar"
                        />
                      }
                      onPress={() => {
                        if (ingKeyToAdd != "" && ingNameToAdd != "") {
                          setIngredientInfos((ingredientInfos) => [
                            ...ingredientInfos,
                            [ingNameToAdd, ingKeyToAdd, ingredientInfos.length],
                          ]);
                          setIngInfos((ingredientInfos) => {
                            var tmpIng = [];
                            var newIdx = 0;
                            ingredientInfos.map((iteminginf, idxinginf) => {
                              if (iteminginf[0] == ingNameToAdd) {
                                console.log("passing item to remove");
                              } else {
                                tmpIng[newIdx] = [
                                  iteminginf[0],
                                  iteminginf[1],
                                  newIdx,
                                ];
                                newIdx++;
                              }
                            });

                            return tmpIng;
                          });
                          setIngNameToAdd("");
                          setIngKeyToAdd("");
                        } else {
                          return Alert.alert(
                            "Ingredientes",
                            "Preencha todos os campos."
                          );
                        }
                      }}
                      alignSelf={"center"}
                      borderRadius="full"
                      rounded="full"
                      h={14}
                      w={14}
                      ml={2}
                      bg={"green.700"}
                      _icon={{
                        color: "gray.100",
                        size: "md",
                      }}
                      _hover={{
                        bg: "green.500",
                      }}
                      _pressed={{
                        bg: "green.500",
                        _icon: {
                          name: "adicionar",
                        },
                      }}
                    />
                  </HStack>

                  {ingredientInfos.length == 0 ? (
                    <Text
                      color="gray.200"
                      fontSize="xl"
                      mt={5}
                      textAlign="center"
                    >
                      Nenhum ingrediente adicionado *
                    </Text>
                  ) : (
                    <Box>
                      <Text
                        color="gray.200"
                        fontSize="xl"
                        my={5}
                        textAlign="center"
                      >
                        {ingredientInfos.length}{" "}
                        {ingredientInfos.length == 1
                          ? "ingrediente adicionado"
                          : "ingredientes adicionados"}
                      </Text>
                      {ingredientInfos.map((item, idx) => {
                        return (
                          <HStack key={idx} w={"100%"} alignContent={"center"}>
                            <Box
                              justifyContent={"center"}
                              borderWidth={0}
                              pl={5}
                              rounded="sm"
                              flex={1}
                              w={"100%"}
                              m={2}
                              h={14}
                              backgroundColor="green.900"
                            >
                              <Heading
                                color="gray.100"
                                fontWeight={"light"}
                                fontSize="xl"
                              >
                                {item[0]}
                              </Heading>
                            </Box>
                            <IconButton
                              icon={
                                <Icon
                                  as={<Minus color={colors.gray[100]} />}
                                  name="remover"
                                />
                              }
                              onPress={() => {
                                setIngredientInfos((ingredientInfos) => {
                                  var tmpIng = [];
                                  var newIdx = 0;
                                  ingredientInfos.map(
                                    (iteminginf, idxinginf) => {
                                      if (idxinginf == idx) {
                                        setIngInfos((ingredientInfos) => [
                                          ...ingredientInfos,
                                          [
                                            iteminginf[0],
                                            iteminginf[1],
                                            ingredientInfos.length,
                                          ],
                                        ]);
                                      } else {
                                        tmpIng[newIdx] = [
                                          iteminginf[0],
                                          iteminginf[1],
                                          newIdx,
                                        ];
                                        newIdx++;
                                      }
                                    }
                                  );

                                  return tmpIng;
                                });
                              }}
                              alignSelf={"center"}
                              borderRadius="full"
                              rounded="full"
                              h={14}
                              w={14}
                              ml={2}
                              bg={"green.700"}
                              _icon={{
                                color: "gray.100",
                                size: "md",
                              }}
                              _hover={{
                                bg: "green.500",
                              }}
                              _pressed={{
                                bg: "green.500",
                                _icon: {
                                  name: "remover",
                                },
                              }}
                            />
                          </HStack>
                        );
                      })}
                    </Box>
                  )}

                  <Divider my={10} bgColor={"green.500"} />
                  <Heading
                    color="gray.100"
                    fontSize={"xl"}
                    ml={2}
                    mb={4}
                    alignSelf={"center"}
                    textAlign={"left"}
                  >
                    Condições de saúde:
                  </Heading>
                  <HStack alignContent={"center"}>
                    <InfoSelect
                      data={nutRelInfos}
                      flex={1}
                      m={2}
                      key={nutRelKeyToAdd}
                      w={"100%"}
                      accessibilityLabel="Selecione"
                      selectedValue={nutRelKeyToAdd}
                      placeholder={"Selecione"}
                      onValueChange={(itemValue) => {
                        setNutRelKeyToAdd(itemValue);
                        for (var x = 0; x < nutRelInfos.length; x++) {
                          if (nutRelInfos[x][1] == itemValue) {
                            setNutRelNameToAdd(nutRelInfos[x][0]);
                          }
                        }
                      }}
                    />
                    <IconButton
                      icon={
                        <Icon
                          as={<Plus color={colors.gray[100]} />}
                          name="adicionar"
                        />
                      }
                      onPress={() => {
                        if (nutRelKeyToAdd != "" && nutRelNameToAdd != "") {
                          setNutritionalRelevanceInfos(
                            (nutritionalRelevanceInfos) => [
                              ...nutritionalRelevanceInfos,
                              [
                                nutRelNameToAdd,
                                nutRelKeyToAdd,
                                nutritionalRelevanceInfos.length,
                              ],
                            ]
                          );
                          setNutRelInfos((nutritionalRelevanceInfos) => {
                            var tmpNutRel = [];
                            var newIdx = 0;
                            nutritionalRelevanceInfos.map(
                              (itemnutrelinf, idxinginf) => {
                                if (itemnutrelinf[0] == nutRelNameToAdd) {
                                  console.log("passing item to remove");
                                } else {
                                  tmpNutRel[newIdx] = [
                                    itemnutrelinf[0],
                                    itemnutrelinf[1],
                                    newIdx,
                                  ];
                                  newIdx++;
                                }
                              }
                            );

                            return tmpNutRel;
                          });
                          setNutRelNameToAdd("");
                          setNutRelKeyToAdd("");
                        } else {
                          return Alert.alert(
                            "Condições de saúde",
                            "Preencha todos os campos."
                          );
                        }
                      }}
                      alignSelf={"center"}
                      borderRadius="full"
                      rounded="full"
                      h={14}
                      w={14}
                      ml={2}
                      bg={"green.700"}
                      _icon={{
                        color: "gray.100",
                        size: "md",
                      }}
                      _hover={{
                        bg: "green.500",
                      }}
                      _pressed={{
                        bg: "green.500",
                        _icon: {
                          name: "adicionar",
                        },
                      }}
                    />
                  </HStack>

                  {nutritionalRelevanceInfos.length == 0 ? (
                    <Text
                      color="gray.200"
                      fontSize="xl"
                      mt={5}
                      textAlign="center"
                    >
                      Nenhuma condição adicionada *
                    </Text>
                  ) : (
                    <Box>
                      <Text
                        color="gray.200"
                        fontSize="xl"
                        my={5}
                        textAlign="center"
                      >
                        {nutritionalRelevanceInfos.length}{" "}
                        {nutritionalRelevanceInfos.length == 1
                          ? "condição adicionada"
                          : "condições adicionadas"}
                      </Text>
                      {nutritionalRelevanceInfos.map((item, idx) => {
                        return (
                          <HStack key={idx} w={"100%"} alignContent={"center"}>
                            <Box
                              justifyContent={"center"}
                              borderWidth={0}
                              pl={5}
                              rounded="sm"
                              flex={1}
                              w={"100%"}
                              m={2}
                              h={14}
                              backgroundColor="green.900"
                            >
                              <Heading
                                color="gray.100"
                                fontWeight={"light"}
                                fontSize="xl"
                              >
                                {item[0]}
                              </Heading>
                            </Box>
                            <IconButton
                              icon={
                                <Icon
                                  as={<Minus color={colors.gray[100]} />}
                                  name="remover"
                                />
                              }
                              onPress={() => {
                                setNutritionalRelevanceInfos(
                                  (nutritionalRelevanceInfos) => {
                                    var tmpNutRel = [];
                                    var newIdx = 0;
                                    nutritionalRelevanceInfos.map(
                                      (itemnutrelinf, idxutrelinf) => {
                                        if (idxutrelinf == idx) {
                                          setNutRelInfos(
                                            (nutritionalRelevanceInfos) => [
                                              ...nutritionalRelevanceInfos,
                                              [
                                                itemnutrelinf[0],
                                                itemnutrelinf[1],
                                                nutritionalRelevanceInfos.length,
                                              ],
                                            ]
                                          );
                                        } else {
                                          tmpNutRel[newIdx] = [
                                            itemnutrelinf[0],
                                            itemnutrelinf[1],
                                            newIdx,
                                          ];
                                          newIdx++;
                                        }
                                      }
                                    );

                                    return tmpNutRel;
                                  }
                                );
                              }}
                              alignSelf={"center"}
                              borderRadius="full"
                              rounded="full"
                              h={14}
                              w={14}
                              ml={2}
                              bg={"green.700"}
                              _icon={{
                                color: "gray.100",
                                size: "md",
                              }}
                              _hover={{
                                bg: "green.500",
                              }}
                              _pressed={{
                                bg: "green.500",
                                _icon: {
                                  name: "remover",
                                },
                              }}
                            />
                          </HStack>
                        );
                      })}
                    </Box>
                  )}
                </>
              ) : (
                <></>
              )}
            </Center>
            <Divider mt={10} bgColor={"green.500"} />
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
