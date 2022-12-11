import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { SignOut } from "phosphor-react-native";
import {
  Text,
  VStack,
  HStack,
  IconButton,
  useTheme,
  Heading,
  Center,
  ScrollView,
  Image,
  Box,
} from "native-base";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";

import Logo from "../assets/NutriFormando_2.svg";
import AppleLogo from "../assets/ÍconeMaçã.svg";
import storage from "@react-native-firebase/storage";

export default function Home() {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [canLoad, setCanLoad] = useState(false);
  const [userInfos, setUserInfos] = useState({});
  const [advertisingInfos, setAdvertisingInfos] = useState({});
  const [advertisingUrl, setAdvertisingUrl] = useState("");
  const { colors } = useTheme();
  const barcode = "";
  var confirm = false;
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      console.log(user.uid);
      setIsLoading(true);
      loadAdvertisingInfos();
      loadUserInfos();
    }, [])
  );

  useEffect(() => {
    if (advertisingInfos != {} && userInfos != {} && canLoad == true) {
      setCanLoad(false);
      loadAdvertisingImage();
    }
  }, [advertisingInfos != {} && userInfos != {} && canLoad == true]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function loadAdvertisingImage() {
    let advToShow = getRandomInt(0, Object.keys(advertisingInfos).length - 1);
    console.log("name: ", `${advertisingInfos[advToShow].advName}.jpg`);
    const url = await storage()
      .ref(`${advertisingInfos[advToShow].advName}.jpg`)
      .getDownloadURL();

    setAdvertisingUrl(url);
    console.log("url: ", url);
  }
  async function loadAdvertisingInfos() {
    const subscriber = firestore()
      .collection("Advertisings")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { advName } = doc.data();

          return {
            AdvId: doc.id,
            advName,
          };
        });
        setAdvertisingInfos(data);
      });

    return subscriber;
  }
  async function loadUserInfos() {
    const userInfos = await firestore()
      .collection("UserInfos")
      .doc(user.uid)
      .get();
    if (!userInfos.exists) {
      console.log("Informações de usuário não encontradas!");
      setUserInfos({});
      confirm = await asyncAlert(
        "Informações do usuário",
        "Favor finalize suas informações de perfil."
      );
      handleCreateUserInfo();
    } else {
      setUserInfos(userInfos.data());
      console.log("Informações do usuário:", userInfos.data());
      if (
        Object.keys(userInfos.data().premiumClientInfos).length == 0 &&
        userInfos.data().userType == "PremiumClient"
      ) {
        console.log("Informações de usuário premium não encontradas!");
        confirm = await asyncAlert(
          "Usuário premium",
          "Favor finalize seu perfil com suas informações de saúde."
        );
        handleCreatePremiumUserInfo();
      }
    }
    setIsLoading(false);
    setCanLoad(true);
  }

  const asyncAlert = (title, description) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title,
        description,
        [
          {
            text: "Ok",
            onPress: () => resolve(true),
            style: "default",
          },
        ],
        {
          cancelable: false,
          onDismiss: () => resolve(false),
        }
      );
    });
  };

  async function DebugThings() {
    console.log(user);
    await auth()
      .createUserWithEmailAndPassword("lalaaa@teste.com", "123456")
      .then(() => {
        console.log("User account created & signed in!");
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
          console.log(errMsg);
        } else {
          console.error(error);
        }
      });
  }

  function handleNewScan() {
    navigation.navigate("Scan", { tipo: "userScan" });
  }
  function handlePerfil() {
    navigation.navigate("Perfil");
  }
  function handleContact() {
    navigation.navigate("Contact");
  }

  function handleCreateUserInfo() {
    navigation.navigate("Create User Info");
  }
  function handleCreatePremiumUserInfo() {
    navigation.navigate("Create Premium User Info");
  }
  function handleBuyPremium() {
    navigation.navigate("Buy Premium");
  }

  function handleOpenMenuProduct() {
    navigation.navigate("Menu Product");
  }
  function handleOpenMenuEmployee() {
    navigation.navigate("Menu Employee");
  }
  function handleOpenMenuClient() {
    navigation.navigate("Menu Client");
  }
  function handleOpenMenuNutritionalRelevance() {
    navigation.navigate("Menu NutRelevance");
  }
  function handleOpenMenuAdvertising() {
    navigation.navigate("Menu Advertising");
  }

  return (
    <Box flex={1} bg="gray.600">
      <VStack flex={1} bg="gray.600">
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          bg="gray.600"
          pt={12}
          pb={4}
          px={6}
        >
          <Logo />

          <IconButton
            icon={<SignOut size={26} color={colors.gray[300]} />}
            onPress={() =>
              auth()
                .signOut()
                .then(() => console.log("User signed out!"))
            }
          />
        </HStack>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {userInfos.userCompleteName ? (
              <VStack flex={1} px={6} pb={2} justifyContent={"space-between"}>
                <Heading
                  mt={5}
                  color="gray.100"
                  alignSelf={"center"}
                  textAlign={"center"}
                >
                  Olá{" "}
                  {userInfos.userCompleteName?.substring(
                    0,
                    userInfos.userCompleteName?.indexOf(" ")
                  ) == ""
                    ? userInfos.userCompleteName?.substring(
                        userInfos.userCompleteName?.indexOf(" ") + 1
                      )
                    : userInfos.userCompleteName?.substring(
                        0,
                        userInfos.userCompleteName?.indexOf(" ")
                      )}
                  !
                </Heading>
                <AppleLogo alignSelf={"center"} width={"30%"} height={"30%"} />
                <ScrollView>
                  <VStack flex={1} py={2} justifyContent={"center"}>
                    {userInfos.userType == "FreeClient" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Escanear Produto"
                          onPress={handleNewScan}
                        />
                        <Button
                          marginY={2}
                          title="Adquirir Premium"
                          onPress={handleBuyPremium}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Sugestões / Reclamações"
                          onPress={() => {
                            handleContact();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "PremiumClient" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Escanear Produto"
                          onPress={handleNewScan}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Sugestões / Reclamações"
                          onPress={() => {
                            handleContact();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "Desenvolvedor" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Produtos"
                          onPress={handleOpenMenuProduct}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "Analista de marketing" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Anunciantes"
                          onPress={() => {
                            handleOpenMenuAdvertising();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "Atendimento ao consumidor" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Sugestões / Reclamações"
                          onPress={() => {
                            handleContact();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "Nutricionista" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Relevância Nutricional"
                          onPress={handleOpenMenuNutritionalRelevance}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {userInfos.userType == "Admin" ? (
                      <>
                        <Button
                          marginY={2}
                          title="Escanear Produto"
                          onPress={handleNewScan}
                        />
                        <Button
                          marginY={2}
                          title="Produtos"
                          onPress={handleOpenMenuProduct}
                        />
                        <Button
                          marginY={2}
                          title="Funcionários"
                          onPress={handleOpenMenuEmployee}
                        />
                        <Button
                          marginY={2}
                          title="Clientes"
                          onPress={handleOpenMenuClient}
                        />
                        <Button
                          marginY={2}
                          title="Relevância Nutricional"
                          onPress={handleOpenMenuNutritionalRelevance}
                        />
                        <Button
                          marginY={2}
                          title="Anunciantes"
                          onPress={() => {
                            handleOpenMenuAdvertising();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Sugestões / Reclamações"
                          onPress={() => {
                            handleContact();
                          }}
                        />
                        <Button
                          marginY={2}
                          title="Perfil"
                          onPress={() => {
                            handlePerfil();
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </VStack>
                </ScrollView>
              </VStack>
            ) : (
              <Center flex={1}>
                <Heading
                  color="gray.100"
                  fontSize="2xl"
                  alignSelf={"center"}
                  textAlign={"center"}
                >
                  Bem Vindo!
                </Heading>
                <Heading
                  mt={4}
                  color="gray.100"
                  fontSize="xl"
                  alignSelf={"center"}
                  textAlign={"center"}
                >
                  Conclua seu cadastro...
                </Heading>
              </Center>
            )}
          </>
        )}
      </VStack>
      {userInfos.userType == "FreeClient" ? (
        <>
          <VStack
            bgColor={"gray.600"}
            p={2}
            width="full"
            height="12%"
            borderRadius={"xl"}
          >
            {advertisingUrl != "" ? (
              <Image
                source={{
                  uri: advertisingUrl,
                }}
                flex={1}
                borderWidth={2}
                borderColor={"green.500"}
                bgColor={"gray.600"}
                borderRadius={"xl"}
                alt="Anunciante"
                resizeMode={"contain"}
              />
            ) : (
              <></>
            )}
          </VStack>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
