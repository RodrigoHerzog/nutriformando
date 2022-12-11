import React, { useState } from "react";

import firestore from "@react-native-firebase/firestore";

import { useFocusEffect } from "@react-navigation/native";

import { VStack, useTheme, Text, FlatList, Center } from "native-base";

import { ChatTeardropText } from "phosphor-react-native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { CardAdvertising } from "../components/CardAdvertising";

export default function ListAdvertising(navigation) {
  const [isLoading, setIsLoading] = useState(true);
  const [advertisings, setAdvertisings] = useState([]);

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadAdvertisings();
    }, [])
  );

  async function loadAdvertisings() {
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
        setAdvertisings(data);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Anunciantes" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={advertisings}
          keyExtractor={(item) => item.AdvId}
          renderItem={({ item }) => (
            <CardAdvertising data={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                anunciantes.
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
