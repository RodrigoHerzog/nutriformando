import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  VStack,
  HStack,
  ScrollView,
  Center,
  Heading,
  Divider,
  useTheme,
  IconButton,
  Icon,
  Text,
  Box,
} from "native-base";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { SignOut, CaretLeft, Plus, Minus } from "phosphor-react-native";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { InfoSelect } from "../components/InfoSelect";

export default function CreatePremiumUserInformation({ navigation, route }) {
  const { colors } = useTheme();
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    loadNutRelevanceItems();
    loadIngItems();
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

  async function handleNewPremiumUserInfoCreation() {
    setIsLoading(true);
    if (nutritionalRelevanceInfos == [] && ingredientInfos == []) {
      setIsLoading(false);
      return Alert.alert(
        "Informações relevantes",
        "Adicione alguma informação."
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

    const userRef = firestore().collection("UserInfos").doc(user.uid);
    await userRef
      .update({
        premiumClientInfos: {
          IngredientsRelevance: CadIngredientInfos,
          NutritionalRelevance: CadNutritionalRelevanceInfos,
        },
      })
      .then(() => {
        Alert.alert(
          "Informações relevantes",
          "Informações relevantes cadastradas com sucesso."
        );
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Informações relevantes",
          "Não foi possível cadastrar as informações."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={6}
      >
        <IconButton
          icon={<CaretLeft color={colors.gray[200]} size={24} />}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log("User signed out!"))
          }
        />
      </HStack>
      <Divider bgColor={"green.500"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Divider mb={10} bgColor={"green.500"} />
          <Heading color="gray.100" fontSize={"2xl"} textAlign={"center"}>
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
                <Icon as={<Plus color={colors.gray[100]} />} name="adicionar" />
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
                        tmpIng[newIdx] = [iteminginf[0], iteminginf[1], newIdx];
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
            <Text color="gray.200" fontSize="xl" mt={5} textAlign="center">
              Nenhum ingrediente adicionado *
            </Text>
          ) : (
            <Box>
              <Text color="gray.200" fontSize="xl" my={5} textAlign="center">
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
                          ingredientInfos.map((iteminginf, idxinginf) => {
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
                          });

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
                <Icon as={<Plus color={colors.gray[100]} />} name="adicionar" />
              }
              onPress={() => {
                if (nutRelKeyToAdd != "" && nutRelNameToAdd != "") {
                  setNutritionalRelevanceInfos((nutritionalRelevanceInfos) => [
                    ...nutritionalRelevanceInfos,
                    [
                      nutRelNameToAdd,
                      nutRelKeyToAdd,
                      nutritionalRelevanceInfos.length,
                    ],
                  ]);
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
            <Text color="gray.200" fontSize="xl" mt={5} textAlign="center">
              Nenhuma condição adicionada *
            </Text>
          ) : (
            <Box>
              <Text color="gray.200" fontSize="xl" my={5} textAlign="center">
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

          <Divider mt={10} bgColor={"green.500"} />
        </Center>
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewPremiumUserInfoCreation}
      />
    </VStack>
  );
}
