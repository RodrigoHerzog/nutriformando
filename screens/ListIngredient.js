import React, { useState } from "react";

import firestore from "@react-native-firebase/firestore";

import { useFocusEffect } from "@react-navigation/native";

import { VStack, useTheme, Text, FlatList, Center } from "native-base";

import { ChatTeardropText } from "phosphor-react-native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { CardIngredient } from "../components/CardIngredient";

export default function ListIngredients(navigation) {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadIngredients();
    }, [])
  );

  async function loadIngredients() {
    const subscriber = firestore()
      .collection("Ingredients")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { Ingredient } = doc.data();

          return {
            IngId: doc.id,
            Ingredient,
          };
        });
        setIngredients(data);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Ingredientes" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.IngId}
          renderItem={({ item }) => (
            <CardIngredient data={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                ingredientes.
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
