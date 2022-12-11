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

export default function CreateProduct({ navigation, route }) {
  const { colors } = useTheme();
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
  const [nutriInfoNameToAdd, setNutriInfoNameToAdd] = useState("");
  const [nutriInfoKeyToAdd, setNutriInfoKeyToAdd] = useState("");

  const [ingInfos, setIngInfos] = useState([]);
  const [ingredientInfos, setIngredientInfos] = useState([]);

  const [nutriInfos, setNutriInfos] = useState([]);
  const [nutritionalInfos, setNutritionalInfos] = useState([]);

  const [productInfos, setProductInfos] = useState([]);

  var tempNutriItems,
    tempIngItems,
    tempProductItems = [];
  var passedIncrementInAnalytics = false;

  let CadIngredientInfos,
    CadNutritionalInfos = {};

  useEffect(() => {
    loadNutriItems();
    loadIngItems();
    loadProductItems();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (route.params?.barCode) {
      setProductBarCode(route.params?.barCode);
    }
  }, [route.params?.barCode]);

  function handleNewScan() {
    navigation.navigate("Scan", { tipo: "cadastro" });
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
  }

  async function loadNutriItems() {
    tempNutriItems = [];
    var data = await firestore().collection("NutriInfos").get();
    data.forEach((doc) => {
      tempNutriItems.push([doc.data().NutriInfo, doc.id]);
    });
    setNutriInfos(tempNutriItems);
  }

  async function loadIngItems() {
    tempIngItems = [];
    var data = await firestore().collection("Ingredients").get();
    data.forEach((doc) => {
      tempIngItems.push([doc.data().Ingredient, doc.id]);
    });
    setIngInfos(tempIngItems);
  }

  async function handleNewProductRegister() {
    setIsLoading(true);
    for (var x = 0; x < productInfos.length; x++) {
      if (productInfos[x] == productBarCode) {
        setIsLoading(false);
        return Alert.alert(
          "Produto",
          "Já existe um produto com esse código de barras."
        );
      }
    }

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

    await firestore()
      .collection("Analytics")
      .doc("ProductsCount")
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
        .collection("Products")
        .add({
          ProductName: productName,
          ProductDescription: productDescription,
          ProductBarCode: productBarCode,
          ProductPortionQuantity: portionQuantity,
          ProductPortionQuantityType: portionQuantityType,
          ProductNutritionalInfo: CadNutritionalInfos,
          ProductIngredientInfo: CadIngredientInfos,
          ProductTransgenic: productTransgenic,
        })
        .then(() => {
          Alert.alert("Produto", "Produto registrado com sucesso.");
          setIsLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Produto",
            "Não foi possível registrar o produto."
          );
        });
    } else {
      setIsLoading(false);
      return Alert.alert("Produto", "Não foi possível registrar o produto.");
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Novo produto" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Divider mb={10} bgColor={"green.500"} />
        <Heading color="gray.100" fontSize="2xl" alignSelf={"center"} mb={5}>
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
              <Icon as={<Barcode color={colors.gray[100]} />} name="escanear" />
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

        <Heading color="gray.100" fontSize="2xl" alignSelf={"center"} mb={5}>
          Informações do produto
        </Heading>

        <Input placeholder="Nome do produto *" onChangeText={setProductName} />

        <Input
          placeholder="Descrição do produto"
          flex={1}
          mt={2}
          multiline={true}
          textAlignVertical="top"
          onChangeText={(text) => {
            setProductDescription(text);
          }}
        />
        <Divider my={10} bgColor={"green.500"} />
        <HStack space={5} mx={5} justifyContent={"center"}>
          <Checkbox
            value={productTransgenic}
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
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={() => {
          /*console.log("ingredientInfos: ", ingredientInfos, "\n\n", "...");
          console.log("nutritionalInfos: ", nutritionalInfos, "\n\n", "...");*/

          handleNewProductRegister();
        }}
      />
    </VStack>
  );
}
