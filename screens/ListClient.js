import React, { useState, useEffect } from "react";

import firestore from "@react-native-firebase/firestore";

import { useFocusEffect } from "@react-navigation/native";

import { VStack, useTheme, Text, FlatList, Center } from "native-base";

import { ChatTeardropText } from "phosphor-react-native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { CardClientInfo } from "../components/CardClientInfo";

export default function ListClient(navigation) {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfos, setUserInfos] = useState([]);

  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      loadUserInfos();
    }, [])
  );

  async function loadUserInfos() {
    const subscriber = firestore()
      .collection("UserInfos")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { userAge, userCompleteName, userType } = doc.data();

          return {
            UserID: doc.id,
            userAge,
            userCompleteName,
            userType,
          };
        });
        console.log(data);
        let ClientsList = [];
        for (let x = 0; x < data.length; x++) {
          if (
            data[x].userType == "FreeClient" ||
            data[x].userType == "PremiumClient"
          ) {
            ClientsList.push(data[x]);
          }
        }
        console.log(ClientsList);
        setUserInfos(ClientsList);
        setIsLoading(false);
      });

    return subscriber;
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Clientes" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={userInfos}
          keyExtractor={(item) => item.UserID}
          renderItem={({ item }) => (
            <CardClientInfo data={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText color={colors.gray[300]} size={40} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                Você ainda não possui {"\n"}
                clientes.
              </Text>
            </Center>
          )}
        />
      )}
    </VStack>
  );
}
