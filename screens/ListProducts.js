import React, { useState, useEffect } from "react";

import firestore from "@react-native-firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";

import { ChatTeardropText } from "phosphor-react-native";
import { dateFormat } from "../utils/dateFormat";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { CardProduct } from "../components/CardProduct";

export default function ListProducts(navigation) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadProducts();
    }, [])
  );

  async function loadProducts() {
    const subscriber = firestore()
      .collection("Products")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const {
            ProductBarCode,
            ProductName,
            ProductDescription,
            ProductNutritionalInfo,
            ProductIngredientInfo,
            ProductPortionQuantity,
            ProductPortionQuantityType,
            ProductTransgenic,
          } = doc.data();

          return {
            ProdId: doc.id,
            ProductBarCode,
            ProductName,
            ProductDescription,
            ProductNutritionalInfo,
            ProductIngredientInfo,
            ProductPortionQuantity,
            ProductPortionQuantityType,
            ProductTransgenic,
          };
        });

        setProducts(data);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Produtos" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.ProdId}
          renderItem={({ item }) => (
            <CardProduct data={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                produtos.
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
