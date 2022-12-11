import React, { useState, useEffect } from "react";

import firestore from "@react-native-firebase/firestore";

import { useFocusEffect } from "@react-navigation/native";

import { VStack, useTheme, Text, FlatList, Center } from "native-base";

import { ChatTeardropText } from "phosphor-react-native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { CardNutriInfo } from "../components/CardNutriInfo";

export default function ListNutriInfos(navigation) {
  const [isLoading, setIsLoading] = useState(true);
  const [nutriInfos, setNutriInfos] = useState([]);

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadNutriInfos();
    }, [])
  );

  async function loadNutriInfos() {
    const subscriber = firestore()
      .collection("NutriInfos")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { NutriInfo } = doc.data();

          return {
            NutInfID: doc.id,
            NutriInfo,
          };
        });
        setNutriInfos(data);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Informações Nutricionais" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={nutriInfos}
          keyExtractor={(item) => item.NutInfID}
          renderItem={({ item }) => (
            <CardNutriInfo data={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                informações nutricionais.
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
