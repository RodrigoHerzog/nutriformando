import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  Box,
  Circle,
  HStack,
  Text,
  useTheme,
  VStack,
  Pressable,
  IPressableProps,
  IconButton,
  Icon,
  Divider,
  Checkbox,
  Heading,
} from "native-base";
import { PencilSimple, Trash } from "phosphor-react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function CardNutRelevance({ data, type }, ...rest) {
  const navigation = useNavigation();
  var passedIncrementInAnalytics,
    confirmed = false;
  const { colors } = useTheme();

  const [nutriRelevanceInfo, setNutriRelevanceInfo] = useState([]);

  const [nutritionalInfo, setNutritionalInfo] = useState([]);
  const [ingredientInfo, setIngredientInfo] = useState([]);

  useEffect(() => {
    console.log("\n\ntype: ", type, "\n\n");
    let tmpNutRelList = [];
    let tmpNutRelInfoList = [];
    for (const [keyNutRel, valueNutRel] of Object.entries(
      data.ListNutriRelevance
    )) {
      for (const [keyNutRelItem, valueNutRelItem] of Object.entries(
        valueNutRel
      )) {
        console.log(
          "keyNutRelItem, valueNutRelItem ",
          keyNutRelItem,
          valueNutRelItem
        );
        if (keyNutRelItem == "Percentage") {
          tmpNutRelList[0] = valueNutRelItem;
        } else if (keyNutRelItem == "NutriInfoRelevantId") {
          tmpNutRelList[1] = valueNutRelItem;
        } else if (keyNutRelItem == "NutriInfoRelevant") {
          tmpNutRelList[2] = valueNutRelItem;
        }
        //tmpNutRelList.push(valueNutRelItem);
      }
      tmpNutRelInfoList.push(tmpNutRelList);
      tmpNutRelList = [];
    }
    setNutriRelevanceInfo(tmpNutRelInfoList);
    tmpNutRelInfoList = [];
    console.log(
      "\n--------------\nRelevanceInfo:",
      nutriRelevanceInfo,
      "\n--------------\n"
    );

    /*
    let tmpNutList = [];
    let tmpNutInfoList = [];
    for (const [keyNut, valueNut] of Object.entries(
      data.ProductNutritionalInfo
    )) {
      for (const [keyNutItem, valueNutItem] of Object.entries(valueNut)) {
        tmpNutList.push(valueNutItem);
      }
      tmpNutInfoList.push(tmpNutList);
      tmpNutList = [];
    }
    setNutritionalInfo(tmpNutInfoList);
    tmpNutInfoList = [];
    let tmpIngList = [];
    let tmpIngInfoList = [];
    for (const [keyIng, valueIng] of Object.entries(
      data.ProductIngredientInfo
    )) {
      for (const [keyIngItem, valueIngItem] of Object.entries(valueIng)) {
        tmpIngList.push(valueIngItem);
      }
      tmpIngInfoList.push(tmpIngList);
      tmpIngList = [];
    }
    setIngredientInfo(tmpIngInfoList);
    tmpIngInfoList = [];
    console.log(
      "\n--------------\nNutritionalInfo:",
      nutritionalInfo,
      "\n--------------\nIngredientInfos:",
      ingredientInfo,
      "\n--------------\n"
    );
    */
  }, []);

  const asyncConfirmAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Relevância nutricional",
        "Deseja remover a relevância nutricional?",
        [
          {
            text: "Não",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => resolve(true),
            style: "default",
          },
        ],
        {
          cancelable: true,
          onDismiss: () => resolve(false),
        }
      );
    });
  };

  function editNutRelInfo(data) {
    navigation.navigate({
      name: "Edit NutRelevance",
      params: { NutRelData: data },
      merge: true,
    });
  }

  async function removeNutRel(id) {
    confirmed = await asyncConfirmAlert();
    if (confirmed == true) {
      if (data.Type == "general") {
        await firestore()
          .collection("Analytics")
          .doc("GeneralRelevanceCount")
          .update({ numberOfDocs: firestore.FieldValue.increment(-1) })
          .then(() => {
            passedIncrementInAnalytics = true;
          })
          .catch((error) => {
            console.log(error);
            passedIncrementInAnalytics = false;
          });
      } else {
        await firestore()
          .collection("Analytics")
          .doc("SpecificRelevanceCount")
          .update({ numberOfDocs: firestore.FieldValue.increment(-1) })
          .then(() => {
            passedIncrementInAnalytics = true;
          })
          .catch((error) => {
            console.log(error);
            passedIncrementInAnalytics = false;
          });
      }

      if (passedIncrementInAnalytics) {
        await firestore()
          .collection("NutRelevance")
          .doc(id)
          .delete()
          .then(() => {
            Alert.alert(
              "Relevância nutricional",
              "Relevância nutricional removida com sucesso."
            );
          })
          .catch((error) => {
            console.log(error);

            return Alert.alert(
              "Relevância nutricional",
              "Não foi possível remover a relevância nutricional."
            );
          });
      } else {
        return Alert.alert(
          "Relevância nutricional",
          "Não foi possível remover a relevância nutricional."
        );
      }
    }
    confirmed = false;
  }

  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  console.log(data);

  return (
    <>
      {type == data.Type ? (
        <Pressable {...rest}>
          <HStack
            flex={1}
            bg="gray.500"
            my={2}
            borderColor="green.500"
            borderWidth={"1"}
            rounded="sm"
            overflow="hidden"
          >
            <VStack flex={1} m={3} my={4}>
              <HStack
                rounded="sm"
                mb={2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <IconButton
                  icon={
                    <Icon
                      as={<Trash color={colors.gray[100]} />}
                      name="excluir"
                    />
                  }
                  onPress={() => {
                    removeNutRel(data.NutRelevanceId);
                  }}
                  borderRadius="full"
                  rounded="full"
                  h={10}
                  w={10}
                  position={"absolute"}
                  left={0}
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
                      name: "excluir",
                    },
                  }}
                />

                {data.Type == "general" ? (
                  <Text
                    mx={"1/6"}
                    textAlign={"center"}
                    color="white"
                    fontSize="lg"
                  >
                    {capitalizeFirst(
                      data.ListNutriRelevance[0].NutriInfoRelevant
                    )}
                  </Text>
                ) : (
                  <Text
                    mx={"1/6"}
                    textAlign={"center"}
                    color="white"
                    fontSize="lg"
                  >
                    {capitalizeFirst(data.ConditionRelevant)}
                  </Text>
                )}

                <IconButton
                  icon={
                    <Icon
                      as={<PencilSimple color={colors.gray[100]} />}
                      name="editar"
                    />
                  }
                  onPress={() => {
                    editNutRelInfo(data);
                  }}
                  borderRadius="full"
                  rounded="full"
                  h={10}
                  w={10}
                  position={"absolute"}
                  right={0}
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
                      name: "editar",
                    },
                  }}
                />
              </HStack>
              <Divider mt={3} alignSelf={"center"} bgColor={"green.500"} />
              <VStack flex={1} alignItems={"center"}>
                {data.Type == "general" ? (
                  <HStack mt={2} justifyContent={"center"}>
                    <Text
                      textAlign={"center"}
                      color="gray.100"
                      fontSize="lg"
                      lineHeight={"sm"}
                    >
                      {data.ListNutriRelevance[0].Percentage} {"%"}
                    </Text>
                  </HStack>
                ) : (
                  <>
                    {nutriRelevanceInfo.map((item, idx) => {
                      console.log("Item: ", item);
                      return (
                        <VStack
                          flex={1}
                          w={"90%"}
                          flexGrow={1}
                          key={item[1]}
                          overflow={"hidden"}
                        >
                          <HStack my={2} alignSelf={"center"}>
                            {idx == 0 ? (
                              <></>
                            ) : (
                              <Divider bgColor={"green.500"} />
                            )}
                          </HStack>
                          <HStack justifyContent={"space-between"}>
                            <Text
                              textAlign={"left"}
                              color="gray.100"
                              fontSize="md"
                              lineHeight={"sm"}
                              w={"65%"}
                            >
                              {capitalizeFirst(item[2])}
                            </Text>

                            <Text
                              textAlign={"right"}
                              color="gray.100"
                              fontSize="md"
                              w={"25%"}
                              lineHeight={"sm"}
                            >
                              {item[0]}
                              {"%"}
                            </Text>
                          </HStack>
                        </VStack>
                      );
                    })}
                  </>
                )}
                {/*
            <Text mt={3} color="white" fontSize="lg">
              Código de barras:
            </Text>
            <Text color="gray.100" fontSize="md">
              {data.ProductBarCode}
            </Text>
            <Divider
              mt={3}
              alignSelf={"center"}
              w={"1/2"}
              bgColor={"green.500"}
            />
            {data.ProductDescription ? (
              <>
                <Text mt={3} color="white" fontSize="lg">
                  Descrição:
                </Text>
                <Text
                  textAlign={"center"}
                  lineHeight={"sm"}
                  color="gray.100"
                  fontSize="md"
                >
                  {data.ProductDescription}
                </Text>
                <Divider
                  mt={3}
                  alignSelf={"center"}
                  w={"1/2"}
                  bgColor={"green.500"}
                />
              </>
            ) : (
              <></>
            )}

            <Text mt={3} color="white" fontSize="lg">
              Informações nutricionais:
            </Text>

            <Divider
              mt={3}
              alignSelf={"center"}
              w={"1/2"}
              bgColor={"green.500"}
            />

            {data.ProductTransgenic ? (
              <>
                <Text color="white" mt={3} fontSize="md">
                  Produto Transgênico
                </Text>

                <Divider
                  mt={3}
                  alignSelf={"center"}
                  w={"1/2"}
                  bgColor={"green.500"}
                />
              </>
            ) : (
              <></>
            )}

            <HStack mt={2} justifyContent={"space-between"}>
              <Text
                textAlign={"left"}
                color="white"
                fontSize="md"
                lineHeight={"sm"}
                w={"60%"}
              >
                Porção:
              </Text>
              <Text
                textAlign={"right"}
                color="gray.100"
                fontSize="md"
                w={"30%"}
                lineHeight={"sm"}
              >
                {data.ProductPortionQuantity} {data.ProductPortionQuantityType}
              </Text>
            </HStack>

            {nutritionalInfo.map((item, idx) => {
              console.log("Item: ", item);
              return (
                <VStack
                  flex={1}
                  w={"90%"}
                  flexGrow={1}
                  key={item[1]}
                  overflow={"hidden"}
                >
                  <HStack my={2} alignSelf={"center"}>
                    <Divider bgColor={"green.500"} />
                  </HStack>
                  <HStack justifyContent={"space-between"}>
                    <Text
                      textAlign={"left"}
                      color="gray.100"
                      fontSize="md"
                      lineHeight={"sm"}
                      w={"65%"}
                    >
                      {"- "}
                      {capitalizeFirst(item[0])}
                      {":"}
                    </Text>

                    <Text
                      textAlign={"right"}
                      color="gray.100"
                      fontSize="md"
                      w={"25%"}
                      lineHeight={"sm"}
                    >
                      {capitalizeFirst(item[2])} {capitalizeFirst(item[3])}
                    </Text>
                  </HStack>
                </VStack>
              );
            })}

            <Divider
              mt={3}
              alignSelf={"center"}
              w={"1/2"}
              bgColor={"green.500"}
            />
            <Text mt={3} mb={1} color="white" fontSize="lg">
              Ingredientes:
            </Text>

            {ingredientInfo.map((item, idx) => {
              console.log("Item: ", item);
              return (
                <VStack
                  flex={1}
                  flexGrow={1}
                  w={"90%"}
                  key={item[0]}
                  overflow={"hidden"}
                >
                  <HStack my={2} alignSelf={"center"}>
                    <Divider
                      w={idx == 0 ? "1/2" : "100%"}
                      bgColor={"green.500"}
                    />
                  </HStack>
                  <Text
                    textAlign={"left"}
                    color="gray.100"
                    fontSize="md"
                    lineHeight={"sm"}
                  >
                    {"- "}
                    {capitalizeFirst(item[1])}
                  </Text>
                </VStack>
              );
            })}
          */}
              </VStack>
            </VStack>
          </HStack>
        </Pressable>
      ) : (
        <></>
      )}
    </>
  );
}
