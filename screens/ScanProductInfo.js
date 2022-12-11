import React, { useState, useEffect, setState } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Package, CookingPot, Flask, Warning } from "phosphor-react-native";
import {
  VStack,
  ScrollView,
  Heading,
  useTheme,
  HStack,
  Icon,
  Box,
  Divider,
  Stack,
} from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Alert } from "react-native";

export default function ScanProductInfo({ navigation, route }) {
  const { barCode } = route.params;
  const { colors } = useTheme();
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({});
  const [userIngredientsRelevants, setUserIngredientsRelevants] = useState([]);
  const [userNutritionalInfosRelevants, setUserNutritionalInfosRelevants] =
    useState([]);
  const [generalRelevanceData, setGeneralRelevanceData] = useState([]);
  const [specificRelevanceData, setSpecificRelevanceData] = useState([]);
  const [product, setProduct] = useState([]);
  const [productIngredientsInfo, setProductIngredientsInfo] = useState([]);
  const [textListProductIngredientsInfo, setTextListProductIngredientsInfo] =
    useState("");
  const [productNutritionalsInfo, setProductNutritionalsInfo] = useState([]);
  const [productPortion, setProductPortion] = useState([]);
  const [generalAdviceDetected, setGeneralAdviceDetected] = useState([]);
  const [specificAdviceDetected, setSpecificAdviceDetected] = useState([]);
  const [nutritionalAdvicesLimitDetected, setNutritionalAdvicesLimitDetected] =
    useState([]);
  const [ingredientsAdviceDetected, setIngredientsAdviceDetected] = useState(
    []
  );
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [firstGetInfos, setFirstGetInfos] = useState(true);
  const [firstHandleInfos, setFirstHandleInfos] = useState(true);

  var detectedInList = false;
  var detectedInListIndicated = false;
  var indicatedIndex = 0;
  var detectedInListSpecific = false;
  var nutLimitIndex = 0;

  useFocusEffect(
    React.useCallback(() => {
      //console.log(user.uid);
      //console.log(isFirstRun);
      if (isFirstRun) {
        setIsLoading(true);
        loadUserInfo(function () {
          loadNutRelevance(function () {
            loadProduct(function () {});
          });
        });
        setIsFirstRun(false);
      }

      /*
      handleDetectAdvices(function () {
        calculateDetectedAdvices(function () {
          
        });
      });
      */
      //loadUserInfo(loadNutRelevance(loadProduct(handleDetectAdvices())));
    }, [])
  );

  useEffect(() => {
    if (
      productPortion.length != 0 &&
      productNutritionalsInfo.length != 0 &&
      productIngredientsInfo.length != 0 &&
      userNutritionalInfosRelevants.length != 0 &&
      userIngredientsRelevants.length != 0 &&
      specificRelevanceData.length != 0 &&
      generalRelevanceData.length != 0 &&
      textListProductIngredientsInfo != "" &&
      Object.keys(userInfo).length != 0 &&
      Object.keys(product).length != 0 &&
      firstGetInfos == true
    ) {
      handleDetectIngredients();
      handleDetectSpecAdvices();
      handleDetectGenAdvices();
      setFirstGetInfos(false);
    }
  }, [
    productPortion.length != 0 &&
      productNutritionalsInfo.length != 0 &&
      productIngredientsInfo.length != 0 &&
      userNutritionalInfosRelevants.length != 0 &&
      userIngredientsRelevants.length != 0 &&
      specificRelevanceData.length != 0 &&
      generalRelevanceData.length != 0 &&
      textListProductIngredientsInfo != "" &&
      Object.keys(userInfo).length != 0 &&
      Object.keys(product).length != 0 &&
      firstGetInfos == true,
  ]);

  useEffect(() => {
    if (
      generalAdviceDetected.length != 0 &&
      specificAdviceDetected.length != 0 &&
      ingredientsAdviceDetected.length != 0 &&
      firstHandleInfos == true
    ) {
      logInfos();
      setIsLoading(false);
      setFirstHandleInfos(false);
    }
  }, [
    generalAdviceDetected.length != 0 &&
      specificAdviceDetected.length != 0 &&
      ingredientsAdviceDetected.length != 0 &&
      firstHandleInfos == true,
  ]);

  async function logInfos() {
    console.log(
      "\n\n\n\nProduct(product): ",
      product,
      "\n\n",
      "User Infos(userInfo): ",
      userInfo,
      "\n\n",
      "General Advises(generalRelevanceData): ",
      generalRelevanceData,
      "\n\n",
      "Specific Advises(specificRelevanceData): ",
      specificRelevanceData,
      "\n\n",
      "User Ingredient Advises(userIngredientsRelevants): ",
      userIngredientsRelevants,
      "\n\n",
      "User Nutritional Advises(userNutritionalInfosRelevants): ",
      userNutritionalInfosRelevants,
      "\n\n",
      "Product Ingredients(productIngredientsInfo): ",
      productIngredientsInfo,
      "\n\n",
      "Text List Product Ingredients(textListProductIngredientsInfo): ",
      textListProductIngredientsInfo,
      "\n\n",
      "Product Nutritionals(productNutritionalsInfo): ",
      productNutritionalsInfo,
      "\n\n",
      "Product Portion(productPortion): ",
      productPortion,
      "\n\n",
      "Ingredients Advice Detected(ingredientsAdviceDetected): ",
      ingredientsAdviceDetected,
      "\n\n",
      "Specific Advice Detected(specificAdviceDetected): ",
      specificAdviceDetected,
      "\n\n",
      "Nutritional Advices Limit Detected(nutritionalAdvicesLimitDetected): ",
      nutritionalAdvicesLimitDetected,
      "\n\n",
      "General Advice Detected(generalAdviceDetected): ",
      generalAdviceDetected,
      "\n\n\n\n"
    );
  }

  function convert_Measurements_To_G_Or_Ml(valueToConvert, typeOfValue) {
    if (typeOfValue == "l") {
      return valueToConvert * 1000;
    } else if (typeOfValue == "ml") {
      return valueToConvert;
    } else if (typeOfValue == "kg") {
      return valueToConvert * 1000;
    } else if (typeOfValue == "g") {
      return valueToConvert;
    } else if (typeOfValue == "mg") {
      return valueToConvert / 1000;
    } else if (typeOfValue == "mcg") {
      return valueToConvert / 1000 / 1000;
    }
  }

  function calculateSpecDetectedAdvices(advDetected) {
    let qntPortion = parseFloat(productPortion[0].replace(",", "."));
    //console.log("qntPortionBEFORE: ", qntPortion);

    qntPortion = convert_Measurements_To_G_Or_Ml(qntPortion, productPortion[1]);
    //console.log("qntPortionAFTER: ", qntPortion);
    for (let x = 0; x < advDetected.length; x++) {
      //console.log(advDetected[x]);
      let advDetectedPercentage = 0;
      let qntInProduct = parseFloat(advDetected[x][1].replace(",", "."));
      //console.log("qntInProductBEFORE: ", qntInProduct);

      qntInProduct = convert_Measurements_To_G_Or_Ml(
        qntInProduct,
        advDetected[x][2]
      );
      //console.log("qntInProductAFTER: ", qntInProduct);
      //console.log(qntPortion, qntInProduct);
      //let qntPortion = parseFloat(productPortion[0]);
      //let qntInProduct = parseFloat(advDetected[1]);
      advDetectedPercentage = (qntPortion / 100) * qntInProduct;
      /*console.log(
        `(${qntPortion}/100)*${qntInProduct}=${advDetectedPercentage}`
      );*/
      //console.log(advDetectedPercentage);
      /*
      let formattedPercentage = advDetectedPercentage
        .toString()
        .replace(".", ",")
        .concat("%");*/
      advDetected[x].push(advDetectedPercentage);
      //setSpecificAdviceDetected[]
    }
    //console.log(advDetected);
    return advDetected;
  }

  function calculateGenDetectedAdvices(advDetected) {
    let qntPortion = parseFloat(productPortion[0].replace(",", "."));
    //console.log("qntPortionBEFORE: ", qntPortion);

    qntPortion = convert_Measurements_To_G_Or_Ml(qntPortion, productPortion[1]);
    //console.log("qntPortionAFTER: ", qntPortion);
    for (let x = 0; x < advDetected.length; x++) {
      //console.log(advDetected[x]);
      let advDetectedPercentage = 0;
      let qntInProduct = parseFloat(advDetected[x][1].replace(",", "."));
      //console.log("qntInProductBEFORE: ", qntInProduct);

      qntInProduct = convert_Measurements_To_G_Or_Ml(
        qntInProduct,
        advDetected[x][2]
      );
      //console.log("qntInProductAFTER: ", qntInProduct);
      //console.log(qntPortion, qntInProduct);
      //let qntPortion = parseFloat(productPortion[0]);
      //let qntInProduct = parseFloat(advDetected[1]);
      advDetectedPercentage = (qntPortion / 100) * qntInProduct;
      if (advDetected[x][2] == "l" || advDetected[x][2] == "ml") {
        advDetectedPercentage = advDetectedPercentage / 2;
      }

      /*console.log(
        `(${qntPortion}/100)*${qntInProduct}=${advDetectedPercentage}`
      );*/
      //console.log(advDetectedPercentage);
      /*
      let formattedPercentage = advDetectedPercentage
        .toString()
        .replace(".", ",")
        .concat("%");*/
      advDetected[x].push(advDetectedPercentage);
      //setSpecificAdviceDetected[]
    }
    //console.log(advDetected);
    return advDetected;
  }

  function handleDetectIngredients() {
    if (userInfo.userType == "PremiumClient") {
      let ingredientsAdvicesDetected = [];
      for (let x = 0; x < userIngredientsRelevants.length; x++) {
        for (let y = 0; y < productIngredientsInfo.length; y++) {
          if (userIngredientsRelevants[x] == productIngredientsInfo[y]) {
            ingredientsAdvicesDetected.push(productIngredientsInfo[y]);
          }
        }
      }
      if (ingredientsAdvicesDetected.length == 0) {
        setIngredientsAdviceDetected(["empty"]);
      } else {
        setIngredientsAdviceDetected(ingredientsAdvicesDetected);
      }
      //console.log("ingredientsAdvicesDetected: ", ingredientsAdvicesDetected);
    } else {
      setIngredientsAdviceDetected(["NotPremiumClient"]);
    }
  }

  function handleDetectGenAdvices() {
    /*console.log(
      "userNutritionalInfosRelevants: ",
      userNutritionalInfosRelevants
    );*/
    let nutritionalAdvicesToDetect = generalRelevanceData;
    /*for (let x = 0; x < userNutritionalInfosRelevants.length; x++) {
      for (let y = 0; y < specificRelevanceData.length; y++) {
        if (userNutritionalInfosRelevants[x] == specificRelevanceData[y][0]) {
          nutritionalAdvicesToDetect.push(specificRelevanceData[y]);
        }
      }
    }*/
    /*console.log(
      "nutritionalAdvicesToDetectBEFORE: ",
      nutritionalAdvicesToDetect
    );*/
    //nutritionalAdvicesToDetect = nutritionalAdvicesToDetect[0];
    //nutritionalAdvicesToDetect.shift();
    /*console.log(
      "nutritionalAdvicesToDetectAFTER: ",
      nutritionalAdvicesToDetect
    );*/
    let nutritionalAdvicesDetected = [];
    let nutritionalAdvicesLimit = [];
    for (let x = 0; x < nutritionalAdvicesToDetect.length; x++) {
      for (let y = 0; y < productNutritionalsInfo.length; y++) {
        /*console.log(
          nutritionalAdvicesToDetect[x][0],
          productNutritionalsInfo[y][0]
        );*/
        if (nutritionalAdvicesToDetect[x][0] == productNutritionalsInfo[y][0]) {
          //console.log("detected");
          nutritionalAdvicesDetected.push(productNutritionalsInfo[y]);
          nutritionalAdvicesLimit.push(nutritionalAdvicesToDetect[x]);
        }
      }
    }
    /*console.log(
      "nutritionalAdvicesDetectedBEFORE: ",
      nutritionalAdvicesDetected
    );*/
    if (nutritionalAdvicesDetected.length == 1) {
      nutritionalAdvicesDetected = nutritionalAdvicesDetected[0];
    }
    /*console.log(
      "nutritionalAdvicesDetectedAFTER: ",
      nutritionalAdvicesDetected
    );
    console.log("nutritionalAdvicesLimit: ", nutritionalAdvicesLimit);
    console.log("nutritionalAdvicesDetected: ", nutritionalAdvicesDetected);*/
    let percentagesCalculated = calculateGenDetectedAdvices(
      nutritionalAdvicesDetected
    );
    //console.log("percentagesCalculated: ", percentagesCalculated);
    for (let y = 0; y < nutritionalAdvicesLimit.length; y++) {
      nutritionalAdvicesLimit[y][1] = nutritionalAdvicesLimit[y][1].replace(
        ",",
        "."
      );
    }
    let tmpGenNutAdvicesBiggerThanLimit = [];
    for (let x = 0; x < percentagesCalculated.length; x++) {
      for (let y = 0; y < nutritionalAdvicesLimit.length; y++) {
        if (percentagesCalculated[x][0] == nutritionalAdvicesLimit[y][0]) {
          if (percentagesCalculated[x][3] >= nutritionalAdvicesLimit[y][1]) {
            tmpGenNutAdvicesBiggerThanLimit.push(percentagesCalculated[x]);
          }
        }
      }
    }
    if (tmpGenNutAdvicesBiggerThanLimit.length == 0) {
      setGeneralAdviceDetected(["empty"]);
    } else {
      setGeneralAdviceDetected(tmpGenNutAdvicesBiggerThanLimit);
    }
  }

  function handleDetectSpecAdvices() {
    if (userInfo.userType == "PremiumClient") {
      /*console.log(
      "userNutritionalInfosRelevants: ",
      userNutritionalInfosRelevants
    );*/
      let nutritionalAdvicesToDetect = [];
      for (let x = 0; x < userNutritionalInfosRelevants.length; x++) {
        for (let y = 0; y < specificRelevanceData.length; y++) {
          if (userNutritionalInfosRelevants[x] == specificRelevanceData[y][0]) {
            nutritionalAdvicesToDetect.push(specificRelevanceData[y]);
          }
        }
      }
      /*console.log(
    "nutritionalAdvicesToDetectBEFORE: ",
    nutritionalAdvicesToDetect
  );*/
      nutritionalAdvicesToDetect = nutritionalAdvicesToDetect[0];
      nutritionalAdvicesToDetect.shift();
      /*console.log(
    "nutritionalAdvicesToDetectAFTER: ",
    nutritionalAdvicesToDetect
  );*/
      let nutritionalAdvicesDetected = [];
      let nutritionalAdvicesLimit = [];
      for (let x = 0; x < nutritionalAdvicesToDetect.length; x++) {
        for (let y = 0; y < productNutritionalsInfo.length; y++) {
          /*console.log(
        nutritionalAdvicesToDetect[x][0],
        productNutritionalsInfo[y][0]
      );*/
          if (
            nutritionalAdvicesToDetect[x][0] == productNutritionalsInfo[y][0]
          ) {
            //console.log("detected");
            nutritionalAdvicesDetected.push(productNutritionalsInfo[y]);
            nutritionalAdvicesLimit.push(nutritionalAdvicesToDetect[x]);
          }
        }
      }
      /*console.log(
    "nutritionalAdvicesDetectedBEFORE: ",
    nutritionalAdvicesDetected
  );*/
      if (nutritionalAdvicesDetected.length == 1) {
        nutritionalAdvicesDetected = nutritionalAdvicesDetected[0];
      }
      /*console.log(
    "nutritionalAdvicesDetectedAFTER: ",
    nutritionalAdvicesDetected
  );
  console.log("nutritionalAdvicesLimit: ", nutritionalAdvicesLimit);
  console.log("nutritionalAdvicesDetected: ", nutritionalAdvicesDetected);*/
      let percentagesCalculated = calculateSpecDetectedAdvices(
        nutritionalAdvicesDetected
      );
      for (let y = 0; y < nutritionalAdvicesLimit.length; y++) {
        nutritionalAdvicesLimit[y][1] = nutritionalAdvicesLimit[y][1].replace(
          ",",
          "."
        );
      }
      let tmpSpecNutAdvicesBiggerThanLimit = [];
      let nutritionalAdvicesLimitDetected = [];
      for (let x = 0; x < percentagesCalculated.length; x++) {
        for (let y = 0; y < nutritionalAdvicesLimit.length; y++) {
          if (percentagesCalculated[x][0] == nutritionalAdvicesLimit[y][0]) {
            if (percentagesCalculated[x][3] >= nutritionalAdvicesLimit[y][1]) {
              tmpSpecNutAdvicesBiggerThanLimit.push(percentagesCalculated[x]);
              nutritionalAdvicesLimitDetected.push(nutritionalAdvicesLimit[y]);
            }
          }
        }
      }
      if (tmpSpecNutAdvicesBiggerThanLimit.length == 0) {
        setSpecificAdviceDetected(["empty"]);
        setNutritionalAdvicesLimitDetected(["empty"]);
      } else {
        setSpecificAdviceDetected(tmpSpecNutAdvicesBiggerThanLimit);
        setNutritionalAdvicesLimitDetected(nutritionalAdvicesLimitDetected);
      }
    } else {
      setSpecificAdviceDetected(["NotPremiumClient"]);
      setNutritionalAdvicesLimitDetected(["NotPremiumClient"]);
    }
  }

  async function loadUserInfo(callback) {
    const userInfos = await firestore()
      .collection("UserInfos")
      .doc(user.uid)
      .get();
    setUserInfo(userInfos.data());
    if (userInfos.data().userType == "PremiumClient") {
      let tmpUserIngredientsRelevants = [];
      for (const [key, value] of Object.entries(
        userInfos.data().premiumClientInfos.IngredientsRelevance
      )) {
        for (const [key1, value1] of Object.entries(value)) {
          if (key1 == "name") {
            tmpUserIngredientsRelevants.push(value1);
          }
        }
      }
      setUserIngredientsRelevants(tmpUserIngredientsRelevants);
      let tmpUserNutritionalRelevants = [];
      for (const [key, value] of Object.entries(
        userInfos.data().premiumClientInfos.NutritionalRelevance
      )) {
        for (const [key1, value1] of Object.entries(value)) {
          if (key1 == "name") {
            tmpUserNutritionalRelevants.push(value1);
          }
        }
      }
      setUserNutritionalInfosRelevants(tmpUserNutritionalRelevants);
    } else {
      setUserIngredientsRelevants(["NotPremiumClient"]);
      setUserNutritionalInfosRelevants(["NotPremiumClient"]);
    }
    callback();
  }

  async function loadNutRelevance(callback) {
    const subscriber = firestore()
      .collection("NutRelevance")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { ConditionRelevant, ListNutriRelevance, Type } = doc.data();

          return {
            NutRelevanceId: doc.id,
            ConditionRelevant,
            ListNutriRelevance,
            Type,
          };
        });
        let tempGenRelData = {};
        let tempSpcRelData = {};
        let idxGen = 0;
        let idxSpc = 0;
        data.map((doc) => {
          if (doc.Type == "general") {
            tempGenRelData[idxGen] = {
              NutRelevanceId: doc.NutRelevanceId,
              ConditionRelevant: doc.ConditionRelevant,
              ListNutriRelevance: doc.ListNutriRelevance,
              Type: doc.Type,
            };
            idxGen++;
          } else if (doc.Type == "specific") {
            tempSpcRelData[idxSpc] = {
              NutRelevanceId: doc.NutRelevanceId,
              ConditionRelevant: doc.ConditionRelevant,
              ListNutriRelevance: doc.ListNutriRelevance,
              Type: doc.Type,
            };
            idxSpc++;
          }
        });

        let tempGenRelDataList = [];
        let tempGenRelDataItem = [];
        for (const [key, value] of Object.entries(tempGenRelData)) {
          for (const [key1, value1] of Object.entries(
            value.ListNutriRelevance
          )) {
            for (const [key2, value2] of Object.entries(value1)) {
              //console.log("key2: value2:   ", key2, value2);
              if (key2 == "NutriInfoRelevant") {
                tempGenRelDataItem[0] = value2;
              } else if (key2 == "Percentage") {
                tempGenRelDataItem[1] = value2;
              }
            }
            tempGenRelDataList.push(tempGenRelDataItem);
            tempGenRelDataItem = [];
          }
        }
        setGeneralRelevanceData(tempGenRelDataList);
        let tempSpcRelDataList = [];
        let tempSpcRelDataItem = [];
        for (const [key, value] of Object.entries(tempSpcRelData)) {
          tempSpcRelDataItem[0] = value.ConditionRelevant;
          for (const [key1, value1] of Object.entries(
            value.ListNutriRelevance
          )) {
            let tmpSpcRelDataSubItem = [];
            for (const [key2, value2] of Object.entries(value1)) {
              if (key2 == "NutriInfoRelevant") {
                tmpSpcRelDataSubItem[0] = value2;
              } else if (key2 == "Percentage") {
                tmpSpcRelDataSubItem[1] = value2;
              }
            }
            tempSpcRelDataItem.push(tmpSpcRelDataSubItem);
          }
          tempSpcRelDataList.push(tempSpcRelDataItem);
          tempSpcRelDataItem = [];
        }
        setSpecificRelevanceData(tempSpcRelDataList);
      });

    return subscriber, callback();
  }

  async function loadProduct(callback) {
    const citiesRef = firestore().collection("Products");
    const snapshot = await citiesRef
      .where("ProductBarCode", "==", barCode)
      .get();
    if (snapshot.empty) {
      navigation.goBack();
      return Alert.alert(
        "Detalhes do produto",
        "O código de barras não está cadastrado no banco de dados"
      );
    }
    let tmpIngData = {};
    let tmpNutData = {};
    snapshot.forEach((doc) => {
      setProduct(doc.data());
      setProductPortion([
        doc.data().ProductPortionQuantity,
        doc.data().ProductPortionQuantityType,
      ]);
      tmpIngData = doc.data().ProductIngredientInfo;
      tmpNutData = doc.data().ProductNutritionalInfo;
    });
    let tmpIngList = [];
    let tmpNutList = [];
    for (const [key, value] of Object.entries(tmpIngData)) {
      tmpIngList.push(value.name);
    }
    let tmpTextIngredients = "";
    let tmpTextToAddIngredients = "";
    for (let x = 0; x < tmpIngList.length; x++) {
      if (x == tmpIngList.length - 1) {
        tmpTextToAddIngredients = capitalizeFirst(tmpIngList[x]) + ".";
        tmpTextIngredients = tmpTextIngredients.concat(tmpTextToAddIngredients);
      } else {
        tmpTextToAddIngredients = capitalizeFirst(tmpIngList[x]) + ", ";
        tmpTextIngredients = tmpTextIngredients.concat(tmpTextToAddIngredients);
      }
    }
    setTextListProductIngredientsInfo(tmpTextIngredients);
    setProductIngredientsInfo(tmpIngList);
    for (const [key, value] of Object.entries(tmpNutData)) {
      tmpNutList.push([value.name, value.quantity, value.quantityType]);
    }
    setProductNutritionalsInfo(tmpNutList);
    callback();
  }

  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleNewProductCreation() {
    navigation.navigate("Create Product");
  }

  function handleListProducts() {
    navigation.navigate("List Products");
  }

  function handleNewNutriInfoCreation() {
    navigation.navigate("Create NutriInfo");
  }

  function handleListNutriInfo() {
    navigation.navigate("List NutriInfos");
  }

  function handleNewIngredientCreation() {
    navigation.navigate("Create Ingredient");
  }

  function handleListIngredient() {
    navigation.navigate("List Ingredients");
  }

  return (
    <VStack flex={1} px={6} bg="gray.600">
      <Header title="Produto" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack flex={1} pb={6} justifyContent={"flex-start"}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Divider mb={5} bgColor={"green.500"} />
              <Heading color="gray.100" fontSize="2xl" textAlign={"center"}>
                {product.ProductName}
              </Heading>
              <HStack alignItems={"center"} justifyContent={"center"}>
                <Box
                  mt={10}
                  mr={1}
                  bgColor={"green.700"}
                  w={50}
                  h={50}
                  rounded="lg"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Icon
                    as={<Package color={colors.gray[100]} size={25} />}
                    name="produto"
                  />
                </Box>
                <VStack flex={1} alignSelf={"center"}>
                  <Divider
                    my={5}
                    w={"1/2"}
                    alignSelf={"center"}
                    bgColor={"green.500"}
                  />
                  <Heading
                    flex={1}
                    color="gray.100"
                    fontSize="md"
                    textAlign={"center"}
                  >
                    {product.ProductDescription}
                  </Heading>
                </VStack>
              </HStack>
              {generalAdviceDetected.length > 0 ||
              specificAdviceDetected.length > 0 ||
              ingredientsAdviceDetected.length > 0 ? (
                <>
                  <Divider my={5} bgColor={"green.500"} />

                  <HStack alignItems={"center"} justifyContent={"center"}>
                    <Box
                      mr={3}
                      mt={7}
                      bgColor={"green.700"}
                      w={50}
                      h={50}
                      rounded="lg"
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Icon
                        as={<Warning color={colors.gray[100]} size={25} />}
                        name="produto"
                      />
                    </Box>
                    <VStack flex={1} alignSelf={"center"}>
                      <Heading
                        flex={1}
                        color="amber.300"
                        mb={3}
                        fontSize="2xl"
                        textAlign={"center"}
                      >
                        Atenção
                      </Heading>

                      {generalAdviceDetected.length > 0 &&
                      generalAdviceDetected[0] != "empty" ? (
                        <>
                          <Heading
                            flex={1}
                            color="gray.100"
                            fontSize="md"
                            mb={2}
                            textAlign={"center"}
                          >
                            Este produto ultrapassa as indicações da anvisa:
                          </Heading>
                          <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <VStack flex={1}>
                              {generalAdviceDetected.map(
                                (detectedItem, detectedIdx) => {
                                  detectedInListIndicated = false;
                                  indicatedIndex = 0;
                                  generalRelevanceData.map(
                                    (indicatedItem, indicatedIdx) => {
                                      if (indicatedItem[0] == detectedItem[0]) {
                                        indicatedIndex = indicatedIdx;
                                        detectedInListIndicated = true;
                                      }
                                    }
                                  );
                                  if (detectedInListIndicated) {
                                    return (
                                      <VStack mt={detectedIdx == 0 ? 0 : 1}>
                                        <HStack
                                          alignItems={"flex-start"}
                                          space={2}
                                          justifyContent={"space-between"}
                                        >
                                          <Heading
                                            flex={0.7}
                                            color={"amber.300"}
                                            fontSize="md"
                                            textAlign={"left"}
                                          >
                                            {capitalizeFirst(detectedItem[0])}:
                                          </Heading>
                                          <Heading
                                            flex={0.3}
                                            color={"amber.300"}
                                            fontSize="md"
                                            textAlign={"right"}
                                          >
                                            {detectedItem[3]}%
                                          </Heading>
                                        </HStack>
                                        <HStack
                                          alignItems={"flex-start"}
                                          space={2}
                                          justifyContent={"space-between"}
                                        >
                                          <Heading
                                            flex={0.7}
                                            color={"secondary.700"}
                                            fontSize="md"
                                            textAlign={"left"}
                                          >
                                            Recomendação:
                                          </Heading>
                                          <Heading
                                            flex={0.3}
                                            color={"secondary.700"}
                                            fontSize="md"
                                            textAlign={"right"}
                                          >
                                            {"<"}
                                            {
                                              generalRelevanceData[
                                                indicatedIndex
                                              ][1]
                                            }
                                            %
                                          </Heading>
                                        </HStack>
                                      </VStack>
                                    );
                                  }
                                }
                              )}
                            </VStack>
                          </HStack>
                        </>
                      ) : (
                        <></>
                      )}

                      {ingredientsAdviceDetected.length > 0 &&
                      ingredientsAdviceDetected[0] != "NotPremiumClient" ? (
                        <>
                          <Heading
                            mt={generalAdviceDetected.length > 0 ? 3 : 0}
                            flex={1}
                            color="gray.100"
                            fontSize="md"
                            mb={2}
                            textAlign={"center"}
                          >
                            Este produto contém ingredientes dos quais você
                            possui intolerância:
                          </Heading>
                          <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <VStack flex={1}>
                              {ingredientsAdviceDetected.map(
                                (ingredientItem, ingredientIdx) => {
                                  return (
                                    <VStack mt={ingredientIdx == 0 ? 0 : 1}>
                                      <Heading
                                        flex={0.7}
                                        color={"amber.300"}
                                        fontSize="md"
                                        textAlign={"center"}
                                      >
                                        {capitalizeFirst(ingredientItem)}
                                      </Heading>
                                    </VStack>
                                  );
                                }
                              )}
                            </VStack>
                          </HStack>
                        </>
                      ) : (
                        <></>
                      )}

                      {specificAdviceDetected.length > 0 &&
                      specificAdviceDetected[0] != "NotPremiumClient" ? (
                        <>
                          <Heading
                            mt={
                              generalAdviceDetected.length > 0 ||
                              ingredientsAdviceDetected.length > 0
                                ? 3
                                : 0
                            }
                            flex={1}
                            color="gray.100"
                            fontSize="md"
                            mb={2}
                            textAlign={"center"}
                          >
                            Este produto possui altos indices de alguns
                            nutrientes que não fazem bem a sua saúde:
                          </Heading>
                          <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <VStack flex={1}>
                              {specificAdviceDetected.map(
                                (specificItem, specificIdx) => {
                                  detectedInListSpecific = false;
                                  nutLimitIndex = 0;
                                  nutritionalAdvicesLimitDetected.map(
                                    (nutLimitItem, nutLimitIdx) => {
                                      if (specificItem[0] == nutLimitItem[0]) {
                                        nutLimitIndex = nutLimitIdx;
                                        detectedInListSpecific = true;
                                      }
                                    }
                                  );
                                  if (detectedInListSpecific) {
                                    return (
                                      <VStack mt={specificIdx == 0 ? 0 : 1}>
                                        <HStack
                                          alignItems={"flex-start"}
                                          space={2}
                                          justifyContent={"space-between"}
                                        >
                                          <Heading
                                            flex={0.7}
                                            color={"amber.300"}
                                            fontSize="md"
                                            textAlign={"left"}
                                          >
                                            {capitalizeFirst(specificItem[0])}:
                                          </Heading>
                                          <Heading
                                            flex={0.3}
                                            color={"amber.300"}
                                            fontSize="md"
                                            textAlign={"right"}
                                          >
                                            {specificItem[3]}%
                                          </Heading>
                                        </HStack>
                                        <HStack
                                          alignItems={"flex-start"}
                                          space={2}
                                          justifyContent={"space-between"}
                                        >
                                          <Heading
                                            flex={0.7}
                                            color={"secondary.700"}
                                            fontSize="md"
                                            textAlign={"left"}
                                          >
                                            Recomendação:
                                          </Heading>
                                          <Heading
                                            flex={0.3}
                                            color={"secondary.700"}
                                            fontSize="md"
                                            textAlign={"right"}
                                          >
                                            {"<"}
                                            {
                                              nutritionalAdvicesLimitDetected[
                                                nutLimitIndex
                                              ][1]
                                            }
                                            %
                                          </Heading>
                                        </HStack>
                                      </VStack>
                                    );
                                  }
                                }
                              )}
                            </VStack>
                          </HStack>
                        </>
                      ) : (
                        <></>
                      )}
                    </VStack>
                  </HStack>
                </>
              ) : (
                <></>
              )}

              <Divider my={5} bgColor={"green.500"} />
              <Heading color="gray.100" fontSize="xl" textAlign={"center"}>
                Lista de Ingredientes
              </Heading>
              <HStack alignItems={"center"} justifyContent={"center"}>
                <Box
                  mt={10}
                  mr={1}
                  bgColor={"green.700"}
                  w={50}
                  h={50}
                  rounded="lg"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Icon
                    as={<CookingPot color={colors.gray[100]} size={25} />}
                    name="escanear"
                  />
                </Box>
                <VStack flex={1} alignSelf={"center"}>
                  <Divider
                    w={"1/2"}
                    alignSelf={"center"}
                    my={5}
                    bgColor={"green.500"}
                  />
                  {productIngredientsInfo.map((item, idx) => {
                    detectedInList = false;
                    ingredientsAdviceDetected.map(
                      (detectedItem, detectedIdx) => {
                        if (detectedItem == item) {
                          detectedInList = true;
                        }
                      }
                    );
                    if (detectedInList) {
                      return (
                        <Heading
                          color={"amber.300"}
                          fontSize="md"
                          textAlign={"center"}
                        >
                          {capitalizeFirst(item)}
                        </Heading>
                      );
                    } else {
                      return (
                        <Heading
                          color={"gray.100"}
                          fontSize="md"
                          textAlign={"center"}
                        >
                          {capitalizeFirst(item)}
                        </Heading>
                      );
                    }
                  })}
                </VStack>
              </HStack>

              <Divider my={5} bgColor={"green.500"} />

              <Heading color="gray.100" fontSize="xl" textAlign={"center"}>
                Informações Nutricionais
              </Heading>

              <HStack alignItems={"center"} justifyContent={"center"}>
                <Box
                  mt={10}
                  mr={3}
                  bgColor={"green.700"}
                  w={50}
                  h={50}
                  rounded="lg"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Icon
                    as={<Flask color={colors.gray[100]} size={25} />}
                    name="escanear"
                  />
                </Box>
                <VStack flex={1} alignSelf={"center"}>
                  <Divider
                    w={"1/2"}
                    alignSelf={"center"}
                    my={5}
                    bgColor={"green.500"}
                  />
                  <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <VStack flex={1}>
                      {productNutritionalsInfo.map((item, idx) => {
                        detectedInList = false;
                        specificAdviceDetected.map(
                          (detectedItem, detectedIdx) => {
                            if (detectedItem[0] == item[0]) {
                              detectedInList = true;
                            }
                          }
                        );
                        generalAdviceDetected.map(
                          (detectedItem, detectedIdx) => {
                            if (detectedItem[0] == item[0]) {
                              detectedInList = true;
                            }
                          }
                        );
                        if (detectedInList) {
                          return (
                            <HStack
                              alignItems={"flex-start"}
                              space={2}
                              justifyContent={"space-between"}
                            >
                              <Heading
                                flex={0.7}
                                color={"amber.300"}
                                fontSize="md"
                                textAlign={"left"}
                              >
                                {capitalizeFirst(item[0])}
                              </Heading>
                              <Heading
                                flex={0.3}
                                color={"amber.300"}
                                fontSize="md"
                                textAlign={"right"}
                              >
                                {item[1]} {item[2]}
                              </Heading>
                            </HStack>
                          );
                        } else {
                          return (
                            <HStack
                              alignItems={"flex-start"}
                              space={2}
                              justifyContent={"space-between"}
                            >
                              <Heading
                                flex={0.7}
                                color={"gray.100"}
                                fontSize="md"
                                textAlign={"left"}
                              >
                                {capitalizeFirst(item[0])}
                              </Heading>
                              <Heading
                                flex={0.3}
                                color={"gray.100"}
                                fontSize="md"
                                textAlign={"right"}
                              >
                                {item[1]} {item[2]}
                              </Heading>
                            </HStack>
                          );
                        }
                      })}
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
              <Divider mt={5} bgColor={"green.500"} />
            </>
          )}
          {/*<Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Produtos
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.ProductsCount == undefined ? (
              <Loading />
            ) : analytics.ProductsCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.ProductsCount == 1 ? (
              analytics.ProductsCount + " cadastro"
            ) : (
              analytics.ProductsCount + " cadastros"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar produto"
            onPress={handleNewProductCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar produtos"
            onPress={handleListProducts}
          />
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Informações Nutricionais
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.NutriInfosCount == undefined ? (
              <Loading />
            ) : analytics.NutriInfosCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.NutriInfosCount == 1 ? (
              analytics.NutriInfosCount + " cadastro"
            ) : (
              analytics.NutriInfosCount + " cadastros"
            )}
          </Heading>
          <Button
            marginY={2}
            title="Cadastrar informação nutricional"
            onPress={handleNewNutriInfoCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar informações nutricionais"
            onPress={handleListNutriInfo}
          />
          <Heading
            color="gray.100"
            fontSize="xl"
            alignSelf={"center"}
            mt={5}
            mb={1}
          >
            Ingredientes
          </Heading>
          <Heading color="gray.200" fontSize="sm" alignSelf={"center"} mb={5}>
            {analytics.IngredientsCount == undefined ? (
              <Loading />
            ) : analytics.IngredientsCount == 0 ? (
              "Nenhum cadastro"
            ) : analytics.IngredientsCount == 1 ? (
              analytics.IngredientsCount + " cadastro"
            ) : (
              analytics.IngredientsCount + " cadastros"
            )}
          </Heading>

          <Button
            marginY={2}
            title="Cadastrar ingrediente"
            onPress={handleNewIngredientCreation}
          />
          <Button
            marginY={2}
            title="Listar/Editar ingredientes"
            onPress={handleListIngredient}
          />*/}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
