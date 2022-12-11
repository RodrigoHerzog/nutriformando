import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { VStack, ScrollView, Center, Heading } from "native-base";

import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { utils } from "@react-native-firebase/app";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function CreateAdvertising({ navigation }) {
  const [advertisingName, setAdvertisingName] = useState("");

  const [advertisingList, setAdvertisingList] = useState([]);
  var tempAdvertisingList = [];
  var verifyRepeated = false;
  var index = 0;
  var passedIncrementInAnalytics = false;
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaStatus, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const [image, setImage] = useState(null);
  const [makeCad, setMakeCad] = useState(false);

  useEffect(() => {
    loadAdvertising();
  }, []);

  useEffect(() => {
    if (image != null && advertisingName != "" && makeCad == true) {
      setMakeCad(false);
      console.log("Makerun");
      const reference = storage().ref(`${advertisingName}.jpg`);
      let imglocation = image.split("cache");
      imglocation = imglocation[1];

      // path to existing file on filesystem
      const pathToFile = `${utils.FilePath.CACHES_DIRECTORY}${imglocation}`;
      // uploads file
      const task = reference.putFile(pathToFile);

      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );
      });

      task.then(() => {
        Alert.alert("Novo anúncio", "Novo anúncio registrado com sucesso.");
        navigation.goBack();
        setIsLoading(false);
      });
    }
  }, [image != null && advertisingName != "" && makeCad == true]);

  async function loadAdvertising() {
    tempAdvertisingList = [];
    var data = await firestore().collection("Advertisings").get();
    data.forEach((doc) => {
      tempAdvertisingList.push(doc.data().advName);
    });
    setAdvertisingList(tempAdvertisingList);
  }

  const uploadImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 2],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
    console.log(image);
  };

  async function handleNewAdvertisingRegister() {
    setIsLoading(true);
    if (!advertisingName) {
      setIsLoading(false);
      return Alert.alert(
        "Novo anúncio",
        "Preencha o nome do anúncio a ser adicionado."
      );
    }
    if (image == null) {
      setIsLoading(false);
      return Alert.alert("Novo anúncio", "Insira uma imagem para o anúncio.");
    }
    console.log(advertisingList);
    for (index = 0; index < advertisingList.length; index++) {
      if (advertisingList[index] == advertisingName) {
        verifyRepeated = true;
      }
    }
    if (verifyRepeated) {
      setIsLoading(false);
      verifyRepeated = false;
      return Alert.alert(
        "Novo anúncio",
        "O nome do anúncio já existe na base de dados."
      );
    }
    await firestore()
      .collection("Analytics")
      .doc("AdvertisingCount")
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
        .collection("Advertisings")
        .add({
          advName: advertisingName,
        })
        .then(() => {
          //Alert.alert("Novo anúncio", "Novo anúncio registrado com sucesso.");
          setMakeCad(true);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Novo anúncio",
            "Não foi possível registrar o anúncio."
          );
        });
    } else {
      setIsLoading(false);
      return Alert.alert(
        "Novo anúncio",
        "Não foi possível registrar o anúncio."
      );
    }
    return;
    for (index = 0; index < ingredientsList.length; index++) {
      if (ingredientsList[index] == ingredientName.toLowerCase().trim()) {
        verifyRepeated = true;
      }
    }
    if (verifyRepeated) {
      setIsLoading(false);
      verifyRepeated = false;
      return Alert.alert(
        "Ingrediente",
        "O ingrediente já existe na base de dados."
      );
    }

    await firestore()
      .collection("Analytics")
      .doc("IngredientsCount")
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
        .collection("Ingredients")
        .add({
          Ingredient: ingredientName.toLowerCase().trim(),
        })
        .then(() => {
          Alert.alert("Ingrediente", "Ingrediente registrado com sucesso.");
          setIsLoading(false);
          setIngredientName("");
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          return Alert.alert(
            "Ingrediente",
            "Não foi possível registrar o ingrediente."
          );
        });
    } else {
      setIsLoading(false);
      return Alert.alert(
        "Ingrediente",
        "Não foi possível registrar o ingrediente."
      );
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading color="gray.100" textAlign={"center"}>
            Novo anunciante
          </Heading>
          <Input
            mt={5}
            placeholder="Nome do anunciante"
            onChangeText={setAdvertisingName}
          />
          {image == null ? (
            <Heading
              color="gray.100"
              mt={5}
              fontSize={"xl"}
              textAlign={"center"}
            >
              Nenhuma imagem carregada.
            </Heading>
          ) : (
            <Heading
              color="gray.100"
              mt={5}
              fontSize={"xl"}
              textAlign={"center"}
            >
              Imagem carregada.
            </Heading>
          )}
          <Button
            isDisabled={isLoading}
            title="Selecionar Imagem"
            mt={5}
            onPress={uploadImage}
          />
        </Center>
      </ScrollView>

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewAdvertisingRegister}
      />
    </VStack>
  );
}
