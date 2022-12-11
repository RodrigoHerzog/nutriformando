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
  Divider,
} from "native-base";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { Header } from "../components/Header";

import Logo from "../assets/NutriFormando_2.svg";
import AppleLogo from "../assets/ÍconeMaçã.svg";
import storage from "@react-native-firebase/storage";

export default function Perfil() {
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
      loadUserInfos();
    }, [])
  );

  async function loadUserInfos() {
    const userInfos = await firestore()
      .collection("UserInfos")
      .doc(user.uid)
      .get();
    if (!userInfos.exists) {
      console.log("Informações de usuário não encontradas!");
    } else {
      setUserInfos(userInfos.data());
      setIsLoading(false);
    }
  }

  return (
    <Box flex={1} bg="gray.600">
      <VStack flex={1} px={6} bg="gray.600">
        <Header title="Perfil" />
        {isLoading ? (
          <Loading />
        ) : (
          <>
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
              <Divider
                w={"1/2"}
                alignSelf={"center"}
                mt={5}
                bgColor={"green.500"}
              />
              <AppleLogo alignSelf={"center"} width={"30%"} height={"30%"} />
              <ScrollView>
                <VStack flex={1} pb={2} justifyContent={"center"}>
                  <Divider
                    w={"1/2"}
                    alignSelf={"center"}
                    mb={5}
                    bgColor={"green.500"}
                  />
                  <Heading
                    color="gray.100"
                    fontSize={"xl"}
                    alignSelf={"center"}
                    textAlign={"center"}
                  >
                    Nome:
                  </Heading>
                  <Text
                    fontSize={"xl"}
                    color="gray.100"
                    alignSelf={"center"}
                    textAlign={"center"}
                  >
                    {userInfos.userCompleteName}
                  </Text>
                  <Divider
                    w={"1/2"}
                    alignSelf={"center"}
                    my={5}
                    bgColor={"green.500"}
                  />
                  <Heading
                    color="gray.100"
                    fontSize={"xl"}
                    alignSelf={"center"}
                    textAlign={"center"}
                  >
                    Idade:
                  </Heading>
                  <Text
                    fontSize={"xl"}
                    color="gray.100"
                    alignSelf={"center"}
                    textAlign={"center"}
                  >
                    {userInfos.userAge}
                  </Text>
                  <Divider
                    w={"1/2"}
                    alignSelf={"center"}
                    my={5}
                    bgColor={"green.500"}
                  />
                  {userInfos.userType != "Admin" ? (
                    userInfos.userType == "FreeClient" ||
                    userInfos.userType == "PremiumClient" ? (
                      <>
                        <Heading
                          color="gray.100"
                          fontSize={"xl"}
                          alignSelf={"center"}
                          textAlign={"center"}
                        >
                          Conta:
                        </Heading>
                        <Text
                          fontSize={"xl"}
                          color="gray.100"
                          alignSelf={"center"}
                          textAlign={"center"}
                        >
                          {userInfos.userType == "PremiumClient"
                            ? "Premium"
                            : "Gratuita"}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Heading
                          color="gray.100"
                          fontSize={"xl"}
                          alignSelf={"center"}
                          textAlign={"center"}
                        >
                          Cargo:
                        </Heading>
                        <Text
                          fontSize={"xl"}
                          color="gray.100"
                          alignSelf={"center"}
                          textAlign={"center"}
                        >
                          {userInfos.userType}
                        </Text>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </VStack>
              </ScrollView>
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  );
}
