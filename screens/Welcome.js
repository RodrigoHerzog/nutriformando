import React from "react";
import { VStack, Heading } from "native-base";
import { Button } from "../components/Button";
import Logo from "../assets/NutriFormando_1.svg";

const Welcome = ({ navigation }) => {
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Bem Vindo!!!
      </Heading>

      <Button
        mt={8}
        title="Entrar"
        w="full"
        onPress={() => navigation.navigate("Sign In")}
      />
      <Button
        title="Criar uma conta"
        bg="gray.600"
        fontSize="sm"
        h={10}
        mt={8}
        _pressed={{ bg: "gray.500" }}
        onPress={() => navigation.navigate("Sign Up")}
      ></Button>
    </VStack>
  );
};

export default Welcome;
