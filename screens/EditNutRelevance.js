import { useState, setState, useEffect } from "react";
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
import { Loading } from "../components/Loading";
import { InfoSelect } from "../components/InfoSelect";

import { Plus, Minus, Barcode } from "phosphor-react-native";

export default function EditNutRelevance({ navigation, route }) {
  const [isInfosLoading, setIsInfosLoading] = useState(true);
  const { colors } = useTheme();
  const { NutRelData } = route.params;

  const [nutRelevanceData, setNutRelevanceData] = useState("");
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

  const [productData, setProductData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [productBarCode, setProductBarCode] = useState("");
  const [productName, setProductName] = useState("");
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
  //const [nutriInfoNameToAdd, setNutriInfoNameToAdd] = useState("");
  //const [nutriInfoKeyToAdd, setNutriInfoKeyToAdd] = useState("");

  const [ingInfos, setIngInfos] = useState([]);
  const [ingredientInfos, setIngredientInfos] = useState([]);

  const [nutritionalInfos, setNutritionalInfos] = useState([]);

  const [productInfos, setProductInfos] = useState([]);

  var tempNutriItems,
    tempSpecRelConditionItems,
    tempGenNutRelevanceItems = [];
  var passedIncrementInAnalytics = false;

  let CadIngredientInfos,
    CadNutritionalRelevanceConditionInfos = {};

  var verifyRepeated = false;
  var index = 0;

  useEffect(() => {
    setIsInfosLoading(true);
    //loadItensToEdit();
    if (NutRelData.Type == "general") {
      setNutRelevanceData(NutRelData);
      setNutriInfoNameToAdd(NutRelData.ListNutriRelevance[0].NutriInfoRelevant);
      setNutriInfoKeyToAdd(
        NutRelData.ListNutriRelevance[0].NutriInfoRelevantId
      );
      setPercentageLimit(NutRelData.ListNutriRelevance[0].Percentage);
      loadNutriItems();
    } else {
      setNutRelevanceData(NutRelData);
      setRelevantConditionName(NutRelData.ConditionRelevant);
      loadFormatNutriItems();
    }

    //setProductDescription(NutRelData.ProductDescription);
    //setPortionQuantity(NutRelData.ProductPortionQuantity);
    //setPortionQuantityType(NutRelData.ProductPortionQuantityType);
    //setProductTransgenic(NutRelData.ProductTransgenic);
    //console.log(NutRelData.ProductTransgenic);

    /*setState({ productData: ProdData }, function () {
      console.log("setState productData completed", this.state);
    });*/

    loadSpecRelCoditionItems();
    loadGenNutRelevanceItems();
    console.log("NutRelData: ", NutRelData);
  }, []);

  async function handleLimitPercentage(qnt) {
    qnt = await qnt.replace(/[^0-9]+/g, "");
    setPercentageLimit(qnt);
  }

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
    setIsInfosLoading(false);
  }

  async function loadFormatNutriItems() {
    ////////////////////////////
    tempNutriItems = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriItems.push([doc.data().NutriInfo, doc.id]);
    });
    var tmpNutRelInfoList = await formatNutritionalRelevanceConditionInfos();

    var tmpNut = [];
    var repetionDetected = false;
    var newIdx = 0;
    tempNutriItems.map((itemnutinf, idxnutinf) => {
      console.log(
        "itemnutinf, idxnutinf:                 ",
        itemnutinf,
        idxnutinf
      );
      tmpNutRelInfoList.map((itemnutrel, idxnutrel) => {
        console.log(
          "itemnutrel, idxnutrel:                 ",
          itemnutrel,
          idxnutrel
        );
        if (itemnutinf[0] == itemnutrel[0]) {
          repetionDetected = true;
          console.log("repetionDetected");
        }
      });
      if (!repetionDetected) {
        tmpNut[newIdx] = [itemnutinf[0], itemnutinf[1], newIdx];
        newIdx++;
      }
      repetionDetected = false;
    });
    console.log("tmpNut: ", tmpNut);
    setNutriInfos(tmpNut);
    tmpNutRelInfoList = [];
    setIsInfosLoading(false);
  }

  async function formatNutritionalRelevanceConditionInfos() {
    let tmpNutRelList = ["", "", "", 0];
    let tmpNutRelInfoList = [];
    for (const [keyNutRel, valueNutRel] of Object.entries(
      NutRelData.ListNutriRelevance
    )) {
      tmpNutRelList[3] = keyNutRel;
      for (const [keyNutRelItem, valueNutRelItem] of Object.entries(
        valueNutRel
      )) {
        if (keyNutRelItem == "NutriInfoRelevantId") {
          tmpNutRelList[1] = valueNutRelItem;
        } else if (keyNutRelItem == "NutriInfoRelevant") {
          tmpNutRelList[0] = valueNutRelItem;
        } else if (keyNutRelItem == "Percentage") {
          tmpNutRelList[2] = valueNutRelItem;
        }
      }
      tmpNutRelInfoList.push(tmpNutRelList);
      tmpNutRelList = [];
    }
    setNutritionalRelevanceConditionInfos(tmpNutRelInfoList);
    return tmpNutRelInfoList;
  }

  /*useEffect(async () => {
    console.log("productData: ", productData);
    if (productData != []) {
      //loadNutriItems();
      //loadIngItems();
      //loadProductItems();
      loadItensToEdit();
    }
  }, [productData]);*/

  /*
  useEffect(() => {
    if (route.params?.barCode) {
      setProductBarCode(route.params?.barCode);
    }
  }, [route.params?.barCode]);

  function handleNewScan() {
    navigation.navigate("Scan", { tipo: "edit" });
  }

  async function handleItemQuatity(qnt) {
    qnt = await qnt.replace(/[^0-9,]+/g, "");
    setItemQuantity(qnt);
  }
  async function handlePortionQuatity(qnt) {
    qnt = await qnt.replace(/[^0-9,]+/g, "");
    setPortionQuantity(qnt);
  }

  async function loadProductItems() {
    tempProductItems = [];
    var data = await firestore().collection("Products").get();
    data.forEach((doc) => {
      tempProductItems.push([doc.data().ProductBarCode]);
    });
    setProductInfos(tempProductItems);
    //loadItensToEdit();
  }
*/
  /*
  async function loadNutriItems() {
    tempNutriItems = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriItems.push([doc.data().NutriInfo, doc.id]);
    });
    var tmpNutInfoList = await formatNutriList();

    var tmpNut = [];
    var repetionDetected = false;
    var newIdx = 0;
    tempNutriItems.map((itemnutinf, idxnutinf) => {
      console.log(
        "itemnutinf, idxnutinf:                 ",
        itemnutinf,
        idxnutinf
      );
      tmpNutInfoList.map((itemnut, idxnut) => {
        console.log("itemnut, idxnut:                 ", itemnut, idxnut);
        if (itemnutinf[0] == itemnut[0]) {
          repetionDetected = true;
          console.log("repetionDetected");
        }
      });
      if (!repetionDetected) {
        tmpNut[newIdx] = [itemnutinf[0], itemnutinf[1], newIdx];
        newIdx++;
      }
      repetionDetected = false;
    });
    console.log("tmpNut: ", tmpNut);
    setNutriInfos(tmpNut);
    tmpNutInfoList = [];
  }

  async function formatNutriList() {
    let tmpNutList = ["", "", "", "", 0];
    let tmpNutInfoList = [];
    for (const [keyNut, valueNut] of Object.entries(
      NutRelData.ProductNutritionalInfo
    )) {
      tmpNutList[4] = keyNut;
      for (const [keyNutItem, valueNutItem] of Object.entries(valueNut)) {
        if (keyNutItem == "id") {
          tmpNutList[1] = valueNutItem;
        } else if (keyNutItem == "name") {
          tmpNutList[0] = valueNutItem;
        } else if (keyNutItem == "quantity") {
          tmpNutList[2] = valueNutItem;
        } else if (keyNutItem == "quantityType") {
          tmpNutList[3] = valueNutItem;
        }
      }
      tmpNutInfoList.push(tmpNutList);
      tmpNutList = [];
    }
    setNutritionalInfos(tmpNutInfoList);
    return tmpNutInfoList;
  }
*/
  /*

  async function loadIngItems() {
    tempIngItems = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngItems.push([doc.data().Ingredient, doc.id]);
    });
    var tmpIngInfoList = await formatIngList();

    var tmpIng = [];
    var repetionDetected = false;
    var newIdx = 0;
    tempIngItems.map((iteminginf, idxinginf) => {
      console.log(
        "iteminginf, idxinginf:                 ",
        iteminginf,
        idxinginf
      );
      tmpIngInfoList.map((iteming, idxing) => {
        console.log("iteming, idxing:                 ", iteming, idxing);
        if (iteminginf[0] == iteming[0]) {
          repetionDetected = true;
          console.log("repetionDetected");
        }
      });
      if (!repetionDetected) {
        tmpIng[newIdx] = [iteminginf[0], iteminginf[1], newIdx];
        newIdx++;
      }
      repetionDetected = false;
    });
    console.log("tmpIng: ", tmpIng);
    setIngInfos(tmpIng);
    tmpIngInfoList = [];
    setIsInfosLoading(false);
  }
  
  async function formatIngList() {
    let tmpIngList = ["", "", 0];
    let tmpIngInfoList = [];
    for (const [keyIng, valueIng] of Object.entries(
      NutRelData.ProductIngredientInfo
    )) {
      tmpIngList[2] = keyIng;
      for (const [keyIngItem, valueIngItem] of Object.entries(valueIng)) {
        if (keyIngItem == "id") {
          tmpIngList[1] = valueIngItem;
        } else if (keyIngItem == "name") {
          tmpIngList[0] = valueIngItem;
        }
      }
      tmpIngInfoList.push(tmpIngList);
      tmpIngList = [];
    }
    setIngredientInfos(tmpIngInfoList);
    return tmpIngInfoList;
  }

  */

  async function handleIngredientEdit() {
    setIsLoading(true);

    if (NutRelData.Type == "general") {
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
    if (
      !productBarCode ||
      !productName ||
      !portionQuantity ||
      !portionQuantityType ||
      ingredientInfos == [] ||
      nutritionalInfos == []
    ) {
      setIsLoading(false);
      return Alert.alert("Produto", "Preencha todos os campos obrigatórios.");
    }

    if (productData.ProductBarCode != productBarCode) {
      for (var x = 0; x < productInfos.length; x++) {
        if (productInfos[x] == productBarCode) {
          verifyRepeated = true;
        }
      }
      if (verifyRepeated) {
        setIsLoading(false);
        verifyRepeated = false;
        return Alert.alert(
          "Produto",
          "Já existe um produto com esse código de barras."
        );
      }
    }
    */

    if (NutRelData.Type == "specific") {
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

    CadNutritionalInfos = Object.fromEntries(
      nutritionalInfos.map((nut) => [
        nut[4],
        {
          name: nut[0],
          id: nut[1],
          quantity: nut[2],
          quantityType: nut[3],
        },
      ])
    );

    */

    if (NutRelData.Type == "general") {
      const NutRel = firestore()
        .collection("NutRelevance")
        .doc(NutRelData.NutRelevanceId);
      await NutRel.update({
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
            "Relevância nutricional editada com sucesso."
          );
          setIsLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Relevância nutricional",
            "Não foi possível editar a relevância nutricional."
          );
        });
    } else {
      const NutRel = firestore()
        .collection("NutRelevance")
        .doc(NutRelData.NutRelevanceId);
      await NutRel.update({
        ConditionRelevant: relevantConditionName,
        Type: "specific",
        ListNutriRelevance: CadNutritionalRelevanceConditionInfos,
      })
        .then(() => {
          Alert.alert(
            "Relevância nutricional",
            "Relevância nutricional editada com sucesso."
          );
          setIsLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Relevância nutricional",
            "Não foi possível editar a relevância nutricional."
          );
        });
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      {NutRelData.Type == "general" ? (
        <Header title="Editar relevância geral" />
      ) : (
        <Header title="Editar relevância específica" />
      )}

      {isInfosLoading ? (
        <Loading />
      ) : (
        <VStack flex={1}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Divider mb={10} bgColor={"green.500"} />
            {nutRelevanceData.Type == "general" ? (
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
                  value={relevantConditionName}
                  placeholder="Nome da condição"
                  onChangeText={setRelevantConditionName}
                />
                <Divider my={10} bgColor={"green.500"} />
              </>
            )}

            <Heading
              color="gray.100"
              fontSize="2xl"
              textAlign={"center"}
              mb={5}
            >
              Nutriente
            </Heading>

            <InfoSelect
              w={"100%"}
              data={nutriInfos}
              mr={2}
              key={nutriInfoKeyToAdd}
              accessibilityLabel="Selecione"
              selectedValue={nutriInfoKeyToAdd}
              defaultValue={nutriInfoKeyToAdd}
              placeholder={
                nutRelevanceData.Type == "general"
                  ? nutriInfoNameToAdd
                  : "Selecione"
              }
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
                maxLength={2}
                onChangeText={(qnt) => {
                  handleLimitPercentage(qnt);
                }}
              />

              {nutRelevanceData.Type == "general" ? (
                <></>
              ) : (
                <IconButton
                  icon={
                    <Icon
                      as={<Plus color={colors.gray[100]} />}
                      name="adicionar"
                    />
                  }
                  onPress={() => {
                    if (
                      nutriInfoKeyToAdd != "" &&
                      nutriInfoNameToAdd != "" &&
                      percentageLimit != ""
                    ) {
                      setNutritionalRelevanceConditionInfos(
                        (conditionInfos) => [
                          ...conditionInfos,
                          [
                            nutriInfoNameToAdd,
                            nutriInfoKeyToAdd,
                            percentageLimit,
                            nutritionalRelevanceConditionInfos.length,
                          ],
                        ]
                      );
                      setNutriInfos((conditionInfos) => {
                        var tmpNut = [];
                        var newIdx = 0;
                        conditionInfos.map((itemnutinf, idxnutinf) => {
                          if (itemnutinf[0] == nutriInfoNameToAdd) {
                            console.log("passing item to remove");
                          } else {
                            tmpNut[newIdx] = [
                              itemnutinf[0],
                              itemnutinf[1],
                              newIdx,
                            ];
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

            {nutRelevanceData.Type == "general" ? (
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
                    <Text
                      color="gray.200"
                      fontSize="xl"
                      mb={5}
                      textAlign="center"
                    >
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
                                  conditionInfos.map(
                                    (itemnutinf, idxnutinf) => {
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
                                    }
                                  );

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

            <Heading
              color="gray.100"
              fontSize="2xl"
              alignSelf={"center"}
              mb={5}
            >
              Código de barras
            </Heading>
            <HStack alignContent={"center"} justifyContent={"space-between"}>
              <Input
                placeholder="Código de barras *"
                flex={1}
                value={productBarCode}
                onChangeText={setProductBarCode}
              />
              <IconButton
                icon={
                  <Icon
                    as={<Barcode color={colors.gray[100]} />}
                    name="escanear"
                  />
                }
                onPress={() => {
                  handleNewScan();
                }}
                borderRadius="full"
                rounded="full"
                h={14}
                w={14}
                ml={3}
                alignSelf={"center"}
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
                    name: "escanear",
                  },
                }}
              />
            </HStack>

            <Divider my={10} bgColor={"green.500"} />

            <Heading
              color="gray.100"
              fontSize="2xl"
              alignSelf={"center"}
              mb={5}
            >
              Informações do produto
            </Heading>

            <Input
              placeholder="Nome do produto *"
              value={productName}
              onChangeText={setProductName}
            />

            <Input
              placeholder="Descrição do produto"
              flex={1}
              mt={2}
              multiline={true}
              value={productDescription}
              textAlignVertical="top"
              onChangeText={(text) => {
                setProductDescription(text);
              }}
            />

            <Divider my={10} bgColor={"green.500"} />
            <HStack space={5} mx={5} justifyContent={"center"}>
              <Checkbox
                value={productTransgenic}
                defaultIsChecked={productTransgenic}
                onChange={setProductTransgenic}
                size={"lg"}
                alignSelf={"center"}
                colorScheme={"emerald"}
                accessibilityLabel="Produto Transgênico"
                flex={1}
              />
              <Heading
                color="gray.100"
                alignSelf={"center"}
                textAlign={"center"}
                fontSize="xl"
                ml={1}
                flex={1}
              >
                Produto Transgênico
              </Heading>
            </HStack>

            <Divider my={10} bgColor={"green.500"} />

            <Heading
              color="gray.100"
              fontSize="2xl"
              alignSelf={"center"}
              mb={5}
            >
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
              <InfoSelect
                data={nutriInfos}
                flex={1}
                mr={2}
                key={nutriInfoKeyToAdd}
                w={"100%"}
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
              <IconButton
                icon={
                  <Icon
                    as={<Plus color={colors.gray[100]} />}
                    name="adicionar"
                  />
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
                          tmpNut[newIdx] = [
                            itemnutinf[0],
                            itemnutinf[1],
                            newIdx,
                          ];
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

            {nutritionalInfos.length == 0 ? (
              <Text color="gray.200" fontSize="xl" mt={5} textAlign="center">
                Nenhuma informação nutricional adicionada *
              </Text>
            ) : (
              <Box>
                <Text color="gray.200" fontSize="xl" my={5} textAlign="center">
                  {nutritionalInfos.length}{" "}
                  {nutritionalInfos.length == 1
                    ? "informação nutricional adicionada"
                    : "informações nutricionais adicionadas"}
                </Text>
                {nutritionalInfos.map((item, idx) => {
                  return (
                    <HStack key={idx} flex={1} alignContent={"center"}>
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
                          {item[2] + " " + item[3]}
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
                          setNutritionalInfos((nutritionalInfos) => {
                            var tmpNut = [];
                            var newIdx = 0;
                            nutritionalInfos.map((itemnutinf, idxnutinf) => {
                              if (idxnutinf == idx) {
                                setNutriInfos((nutritionalInfos) => [
                                  ...nutritionalInfos,
                                  [
                                    itemnutinf[0],
                                    itemnutinf[1],
                                    nutritionalInfos.length,
                                  ],
                                ]);
                              } else {
                                tmpNut[newIdx] = [
                                  itemnutinf[0],
                                  itemnutinf[1],
                                  itemnutinf[2],
                                  itemnutinf[3],
                                  newIdx,
                                ];
                                newIdx++;
                              }
                            });

                            return tmpNut;
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
              fontSize="2xl"
              alignSelf={"center"}
              mb={5}
            >
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
                    <HStack flex={1} key={idx} alignContent={"center"}>
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
            title="Confirmar"
            mt={5}
            isLoading={isLoading}
            onPress={handleIngredientEdit}
          />
        </VStack>
      )}
    </VStack>
  );
}
