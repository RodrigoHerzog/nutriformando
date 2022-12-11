import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  VStack,
  ScrollView,
  Heading,
  HStack,
  IconButton,
  Icon,
  useTheme,
  Text,
  Box,
  Divider,
  Checkbox,
} from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { InfoSelect } from "../components/InfoSelect";

import { Plus, Minus, Barcode } from "phosphor-react-native";

export default function CreateNutRelevance({ navigation, route }) {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { tipo } = route.params;

  const [relevantConditionName, setRelevantConditionName] = useState("");
  const [percentageLimit, setPercentageLimit] = useState("");
  const [nutriInfoNameToAdd, setNutriInfoNameToAdd] = useState("");
  const [nutriInfoKeyToAdd, setNutriInfoKeyToAdd] = useState("");
  const [genNutRelevanceInfos, setGenNutRelevanceInfos] = useState([]);
  const [specRelCoditionInfos, setSpecRelCoditionInfos] = useState([]);
  const [
    nutritionalRelevanceConditionInfos,
    setNutritionalRelevanceConditionInfos,
  ] = useState([]);
  const [nutriInfos, setNutriInfos] = useState([]);

  const [productName, setProductName] = useState("");
  const [productBarCode, setProductBarCode] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productTransgenic, setProductTransgenic] = useState(false);

  const [portionQuantity, setPortionQuantity] = useState("");
  const [portionQuantityType, setPortionQuantityType] = useState("");
  const listPortionQntType = [
    ["l", "l"],
    ["ml", "ml"],
    ["kg", "kg"],
    ["g", "g"],
    ["mg", "mg"],
    ["mcg", "mcg"],
  ];

  const [itemQuantity, setItemQuantity] = useState("");
  const [itemQuantityType, setItemQuantityType] = useState("");
  const listItemQntType = [
    ["kcal", "kcal"],
    ["l", "l"],
    ["ml", "ml"],
    ["kg", "kg"],
    ["g", "g"],
    ["mg", "mg"],
    ["mcg", "mcg"],
  ];

  const [ingNameToAdd, setIngNameToAdd] = useState("");
  const [ingKeyToAdd, setIngKeyToAdd] = useState("");

  const [ingInfos, setIngInfos] = useState([]);
  const [ingredientInfos, setIngredientInfos] = useState([]);

  var tempNutriItems,
    tempSpecRelConditionItems,
    tempGenNutRelevanceItems = [];
  var passedIncrementInAnalytics = false;

  let CadIngredientInfos,
    CadNutritionalRelevanceConditionInfos = {};

  useEffect(() => {
    loadNutriItems();
    loadSpecRelCoditionItems();
    loadGenNutRelevanceItems();
    setIsLoading(false);
  }, []);

  /*
  useEffect(() => {
    if (route.params?.barCode) {
      setProductBarCode(route.params?.barCode);
    }
  }, [route.params?.barCode]);

  function handleNewScan() {
    navigation.navigate("Scan", { tipo: "cadastro" });
  }
*/
  async function handleLimitPercentage(qnt) {
    qnt = await qnt.replace(/[^0-9,]+/g, "");
    setPercentageLimit(qnt);
  }
  /*
  async function handlePortionQuatity(qnt) {
    qnt = await qnt.replace(/[^0-9,]+/g, "");
    setPortionQuantity(qnt);
  }
*/
  async function loadSpecRelCoditionItems() {
    tempSpecRelConditionItems = [];
    var data = await firestore().collection("NutRelevance").get();
    data.forEach((doc) => {
      if (doc.data().Type == "specific") {
        tempSpecRelConditionItems.push(
          doc.data().ListNutriRelevance.ConditionRelevant
        );
      }
    });
    setSpecRelCoditionInfos(tempSpecRelConditionItems);
  }

  async function loadGenNutRelevanceItems() {
    tempGenNutRelevanceItems = [];
    var data = await firestore().collection("NutRelevance").get();
    data.forEach((doc) => {
      if (doc.data().Type == "general") {
        tempGenNutRelevanceItems.push(
          doc.data().ListNutriRelevance[0].NutriInfoRelevant
        );
      }
    });
    setGenNutRelevanceInfos(tempGenNutRelevanceItems);
  }

  async function loadNutriItems() {
    tempNutriItems = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriItems.push([doc.data().NutriInfo, doc.id]);
    });
    setNutriInfos(tempNutriItems);
  }
  /*
  async function loadIngItems() {
    tempIngItems = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngItems.push([doc.data().Ingredient, doc.id]);
    });
    setIngInfos(tempIngItems);
  }
*/
  async function handleNewNutRelevanceRegister() {
    setIsLoading(true);
    if (tipo == "general") {
      if (!nutriInfoNameToAdd || !nutriInfoKeyToAdd || !percentageLimit) {
        setIsLoading(false);
        return Alert.alert(
          "Relevância nutricional",
          "Preencha todos os campos."
        );
      }
      for (var x = 0; x < genNutRelevanceInfos.length; x++) {
        if (genNutRelevanceInfos[x] == nutriInfoNameToAdd) {
          setIsLoading(false);
          return Alert.alert(
            "Relevância nutricional",
            "Informação já existe no cadastro."
          );
        }
      }
    } else {
      if (!relevantConditionName) {
        setIsLoading(false);
        return Alert.alert(
          "Relevância nutricional",
          "Preencha todos os campos."
        );
      } else if (nutritionalRelevanceConditionInfos.length == 0) {
        setIsLoading(false);
        return Alert.alert(
          "Relevância nutricional",
          "Adicione ao menos um item."
        );
      }
      for (var x = 0; x < specRelCoditionInfos.length; x++) {
        if (specRelCoditionInfos[x] == relevantConditionName) {
          setIsLoading(false);
          return Alert.alert(
            "Relevância nutricional",
            "Condição de relevância já existe no cadastro."
          );
        }
      }
    }

    /*
    CadIngredientInfos = Object.fromEntries(
      ingredientInfos.map((ing) => [
        ing[2],
        {
          name: ing[0],
          id: ing[1],
        },
      ])
    );
    */
    if (tipo == "specific") {
      CadNutritionalRelevanceConditionInfos = Object.fromEntries(
        nutritionalRelevanceConditionInfos.map((cond) => [
          cond[3],
          {
            NutriInfoRelevant: cond[0],
            NutriInfoRelevantId: cond[1],
            Percentage: cond[2],
          },
        ])
      );
    }

    if (tipo == "general") {
      await firestore()
        .collection("Analytics")
        .doc("GeneralRelevanceCount")
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
          .collection("NutRelevance")
          .add({
            ConditionRelevant: "",
            Type: "general",
            ListNutriRelevance: {
              0: {
                NutriInfoRelevant: nutriInfoNameToAdd,
                NutriInfoRelevantId: nutriInfoKeyToAdd,
                Percentage: percentageLimit,
              },
            },
          })
          .then(() => {
            Alert.alert(
              "Relevância nutricional",
              "Relevância registrada com sucesso."
            );
            setIsLoading(false);
            navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            return Alert.alert(
              "Relevância nutricional",
              "Não foi possível registrar a informação."
            );
          });
      } else {
        setIsLoading(false);
        return Alert.alert(
          "Relevância nutricional",
          "Não foi possível registrar a informação."
        );
      }
    } else {
      await firestore()
        .collection("Analytics")
        .doc("SpecificRelevanceCount")
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
          .collection("NutRelevance")
          .add({
            ConditionRelevant: relevantConditionName,
            Type: "specific",
            ListNutriRelevance: CadNutritionalRelevanceConditionInfos,
          })
          .then(() => {
            Alert.alert(
              "Relevância nutricional",
              "Relevância registrada com sucesso."
            );
            setIsLoading(false);
            navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            return Alert.alert(
              "Relevância nutricional",
              "Não foi possível registrar a informação."
            );
          });
      } else {
        setIsLoading(false);
        return Alert.alert(
          "Relevância nutricional",
          "Não foi possível registrar a informação."
        );
      }
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      {tipo == "general" ? (
        <Header title="Relevância geral" />
      ) : (
        <Header title="Relevância específica" />
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Divider mb={10} bgColor={"green.500"} />
        {tipo == "general" ? (
          <></>
        ) : (
          <>
            <Heading
              color="gray.100"
              fontSize="2xl"
              alignSelf={"center"}
              mb={5}
            >
              Condição de saúde
            </Heading>

            <Input
              placeholder="Nome da condição"
              onChangeText={setRelevantConditionName}
            />
            <Divider my={10} bgColor={"green.500"} />
          </>
        )}

        <Heading color="gray.100" fontSize="2xl" textAlign={"center"} mb={5}>
          Nutriente
        </Heading>
        <InfoSelect
          w={"100%"}
          data={nutriInfos}
          mr={2}
          key={nutriInfoKeyToAdd}
          accessibilityLabel="Selecione"
          selectedValue={nutriInfoKeyToAdd}
          placeholder={"Selecione"}
          onValueChange={(itemValue) => {
            setNutriInfoKeyToAdd(itemValue);
            for (var x = 0; x < nutriInfos.length; x++) {
              if (nutriInfos[x][1] == itemValue) {
                setNutriInfoNameToAdd(nutriInfos[x][0]);
              }
            }
          }}
        />
        <HStack mt={5} space={3} justifyContent="center">
          <Input
            flex={1}
            placeholder="Porcentagem Limite"
            value={percentageLimit}
            keyboardType="numeric"
            maxLength={3}
            onChangeText={(qnt) => {
              handleLimitPercentage(qnt);
            }}
          />

          {tipo == "general" ? (
            <></>
          ) : (
            <IconButton
              icon={
                <Icon as={<Plus color={colors.gray[100]} />} name="adicionar" />
              }
              onPress={() => {
                if (
                  nutriInfoKeyToAdd != "" &&
                  nutriInfoNameToAdd != "" &&
                  percentageLimit != ""
                ) {
                  setNutritionalRelevanceConditionInfos((conditionInfos) => [
                    ...conditionInfos,
                    [
                      nutriInfoNameToAdd,
                      nutriInfoKeyToAdd,
                      percentageLimit,
                      nutritionalRelevanceConditionInfos.length,
                    ],
                  ]);
                  setNutriInfos((conditionInfos) => {
                    var tmpNut = [];
                    var newIdx = 0;
                    conditionInfos.map((itemnutinf, idxnutinf) => {
                      if (itemnutinf[0] == nutriInfoNameToAdd) {
                        console.log("passing item to remove");
                      } else {
                        tmpNut[newIdx] = [itemnutinf[0], itemnutinf[1], newIdx];
                        newIdx++;
                      }
                    });

                    return tmpNut;
                  });
                  setNutriInfoNameToAdd("");
                  setNutriInfoKeyToAdd("");
                  setPercentageLimit("");
                } else {
                  return Alert.alert(
                    "Relevância nutricional",
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
          )}
        </HStack>

        {tipo == "general" ? (
          <></>
        ) : (
          <>
            <Divider my={10} bgColor={"green.500"} />
            {nutritionalRelevanceConditionInfos.length == 0 ? (
              <Text color="gray.200" fontSize="xl" textAlign="center">
                Nenhuma informação nutricional adicionada *
              </Text>
            ) : (
              <Box>
                <Text color="gray.200" fontSize="xl" mb={5} textAlign="center">
                  {nutritionalRelevanceConditionInfos.length}{" "}
                  {nutritionalRelevanceConditionInfos.length == 1
                    ? "informação nutricional adicionada"
                    : "informações nutricionais adicionadas"}
                </Text>
                {nutritionalRelevanceConditionInfos.map((item, idx) => {
                  return (
                    <HStack flex={1} key={idx} alignContent={"center"}>
                      <Box
                        justifyContent={"center"}
                        borderWidth={0}
                        pl={5}
                        rounded="sm"
                        flex={1}
                        w={"100%"}
                        m={2}
                        h={16}
                        backgroundColor="green.900"
                      >
                        <Heading
                          color="gray.100"
                          fontWeight={"light"}
                          fontSize="lg"
                        >
                          {item[0]}
                        </Heading>
                        <Heading
                          color="gray.100"
                          fontWeight={"light"}
                          mt={0.5}
                          fontSize="md"
                        >
                          {item[2] + "%"}
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
                          setNutritionalRelevanceConditionInfos(
                            (conditionInfos) => {
                              var tmpNut = [];
                              var newIdx = 0;
                              conditionInfos.map((itemnutinf, idxnutinf) => {
                                if (idxnutinf == idx) {
                                  setNutriInfos((conditionInfos) => [
                                    ...conditionInfos,
                                    [
                                      itemnutinf[0],
                                      itemnutinf[1],
                                      conditionInfos.length,
                                    ],
                                  ]);
                                } else {
                                  tmpNut[newIdx] = [
                                    itemnutinf[0],
                                    itemnutinf[1],
                                    itemnutinf[2],
                                    newIdx,
                                  ];
                                  newIdx++;
                                }
                              });

                              return tmpNut;
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
        )}
        <Divider mt={10} bgColor={"green.500"} />
        {/*
        <Heading color="gray.100" fontSize="2xl" alignSelf={"center"} mb={5}>
          Informações nutricionais
        </Heading>

        <HStack mb={5} space={3} justifyContent="center">
          <Input
            flex={0.6}
            placeholder="Quantidade da porção *"
            value={portionQuantity}
            keyboardType="numeric"
            onChangeText={(qnt) => {
              handlePortionQuatity(qnt);
            }}
          />
          <InfoSelect
            data={listPortionQntType}
            flex={0.4}
            accessibilityLabel="Tipo *"
            placeholder="Tipo *"
            selectedValue={portionQuantityType}
            onValueChange={(qntType) => {
              setPortionQuantityType(qntType);
            }}
          />
        </HStack>

        <Divider bgColor={"green.900"} />

        <HStack flex={1} mt={5} mb={2} alignContent={"center"}>
          <IconButton
            icon={
              <Icon as={<Plus color={colors.gray[100]} />} name="adicionar" />
            }
            onPress={() => {
              if (
                nutriInfoKeyToAdd != "" &&
                nutriInfoNameToAdd != "" &&
                itemQuantity != "" &&
                itemQuantityType != ""
              ) {
                setNutritionalInfos((nutritionalInfos) => [
                  ...nutritionalInfos,
                  [
                    nutriInfoNameToAdd,
                    nutriInfoKeyToAdd,
                    itemQuantity,
                    itemQuantityType,
                    nutritionalInfos.length,
                  ],
                ]);
                setNutriInfos((nutritionalInfos) => {
                  var tmpNut = [];
                  var newIdx = 0;
                  nutritionalInfos.map((itemnutinf, idxnutinf) => {
                    if (itemnutinf[0] == nutriInfoNameToAdd) {
                      console.log("passing item to remove");
                    } else {
                      tmpNut[newIdx] = [itemnutinf[0], itemnutinf[1], newIdx];
                      newIdx++;
                    }
                  });

                  return tmpNut;
                });
                setNutriInfoNameToAdd("");
                setNutriInfoKeyToAdd("");
                setItemQuantity(0);
                setItemQuantityType("");
              } else {
                return Alert.alert(
                  "Informações Nutricionais",
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
        <HStack my={2} space={3} justifyContent="center">
          <Input
            flex={0.6}
            placeholder="Quantidade"
            value={itemQuantity}
            keyboardType="numeric"
            onChangeText={(qnt) => {
              handleItemQuatity(qnt);
            }}
          />
          <InfoSelect
            data={listItemQntType}
            flex={0.4}
            accessibilityLabel="Tipo"
            placeholder="Tipo"
            selectedValue={itemQuantityType}
            onValueChange={(qntType) => {
              setItemQuantityType(qntType);
            }}
          />
        </HStack>

        <Divider my={10} bgColor={"green.500"} />

        <Heading color="gray.100" fontSize="2xl" alignSelf={"center"} mb={5}>
          Ingredientes
        </Heading>

        <HStack flex={1} alignContent={"center"}>
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
                return Alert.alert("Ingredientes", "Preencha todos os campos.");
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
                <HStack flex={1} alignContent={"center"}>
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

        <Divider mt={10} bgColor={"green.500"} />
          */}
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={() => {
          /*console.log("ingredientInfos: ", ingredientInfos, "\n\n", "...");
          console.log("nutritionalInfos: ", nutritionalInfos, "\n\n", "...");*/

          handleNewNutRelevanceRegister();
        }}
      />
    </VStack>
  );
}
