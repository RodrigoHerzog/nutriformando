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
import { CardNutRelevance } from "../components/CardNutRelevance";

export default function ListNutRelevance({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [nutRelevance, setNutRelevance] = useState([]);

  const { tipo } = route.params;

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadNutRelevance();
    }, [])
  );

  async function loadNutRelevance() {
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
        setNutRelevance(data);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      {tipo == "general" ? (
        <Header title="Relevâncias gerais" />
      ) : (
        <Header title="Relevâncias específicas" />
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={nutRelevance}
          keyExtractor={(item) => item.NutRelevanceId}
          renderItem={({ item }) => (
            <CardNutRelevance data={item} type={tipo} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                {tipo == "general"
                  ? "relevâncias nutricionais gerais."
                  : "relevâncias nutricionais específicas."}
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
