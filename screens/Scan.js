import React, { useState, useEffect } from "react";
import {
  VStack,
  Heading,
  HStack,
  IconButton,
  useTheme,
  Box,
  Icon,
  Button,
} from "native-base";
import { CaretLeft } from "phosphor-react-native";
//import { Button } from "../components/Button";
import Logo from "../assets/NutriFormando_2.svg";
import { StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Barcode } from "phosphor-react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
const Scan = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  const { tipo } = route.params;

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código de barras: ${data}\nEscaneado com sucesso!`);
    if (tipo == "cadastro") {
      navigation.navigate({
        name: "Create Product",
        params: { barCode: data },
        merge: true,
      });
    } else if (tipo == "edit") {
      navigation.navigate({
        name: "Edit Product",
        params: { barCode: data },
        merge: true,
      });
    } else if (tipo == "userScan") {
      navigation.navigate("ScanProductInfo", { barCode: data });
    }
  };

  if (!isFocused) {
    return <></>;
  } else {
    if (hasPermission === null) {
      return (
        <VStack flex={1} pb={6} bg="gray.700">
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={5}
            px={6}
          >
            <IconButton
              icon={<CaretLeft color={colors.gray[200]} size={24} />}
              onPress={handleGoBack}
            />
            <Box flex={1} ml={9}>
              <Logo />
            </Box>
          </HStack>
          <VStack flex={1} alignItems={"center"}>
            <Heading color="gray.100" fontSize="xl" m={5} textAlign={"center"}>
              Pedindo permissão para usar a câmera
            </Heading>
          </VStack>
        </VStack>
      );
    }
    if (hasPermission === false) {
      return (
        <VStack flex={1} pb={6} bg="gray.700">
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={5}
            px={6}
          >
            <IconButton
              icon={<CaretLeft color={colors.gray[200]} size={24} />}
              onPress={handleGoBack}
            />
            <Box flex={1} ml={9}>
              <Logo />
            </Box>
          </HStack>
          <VStack flex={1} alignItems={"center"}>
            <Heading
              color="gray.100"
              textAlign={"center"}
              fontSize="xl"
              mt={4}
              mb={6}
            >
              Permissão para usar a câmera negada.{"\n"}Por favor permita o
              acesso do app a câmera pelas configurações.
            </Heading>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack flex={1} bg="gray.700">
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          bg="gray.600"
          pt={12}
          pb={5}
          px={6}
        >
          <IconButton
            icon={<CaretLeft color={colors.gray[200]} size={24} />}
            onPress={handleGoBack}
          />
          <Box flex={1} ml={9}>
            <Logo />
          </Box>
        </HStack>
        <HStack
          w="full"
          h="full"
          flex={1}
          alignItems={"flex-end"}
          justifyContent={"center"}
        >
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button
              mb={6}
              onPress={() => setScanned(false)}
              bg="green.700"
              fontSize="sm"
              rounded="sm"
              _pressed={{ bg: "green.500" }}
            >
              <Icon
                as={<Barcode color={colors.gray[100]} size={35} />}
                alignSelf={"center"}
                name="escanear"
              />
              <Heading
                mt={1}
                lineHeight={"2xs"}
                color="white"
                fontSize="md"
                alignSelf={"center"}
                textAlign={"center"}
              >
                Escanear{"\n"}novamente
              </Heading>
            </Button>
          )}
        </HStack>
      </VStack>
    );
  }
};

export default Scan;
