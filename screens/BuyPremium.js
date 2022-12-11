import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { VStack, ScrollView, Center, Heading } from "native-base";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function BuyPremium({ navigation, route }) {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  var passedIncrementInAnalytics,
    confirmBuyPremium,
    confirmPremiumPayment,
    confirm = false;

  const asyncConfirmAlert = (title, description, isCancelable) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title,
        description,
        [
          {
            text: "Não",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => resolve(true),
            style: "default",
          },
        ],
        {
          cancelable: isCancelable,
          onDismiss: () => resolve(false),
        }
      );
    });
  };
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

  async function handleBuyPremium() {
    setIsLoading(true);
    confirmBuyPremium = await asyncConfirmAlert(
      "Upgrade de conta",
      "Deseja adquirir uma conta premium?",
      true
    );
    if (confirmBuyPremium == true) {
      confirmPremiumPayment = await asyncConfirmAlert(
        "Pagamento",
        "Confirmar pagamento para NutriFormando?",
        false
      );
      if (confirmPremiumPayment == true) {
        await firestore()
          .collection("Analytics")
          .doc("PremiumClientsCount")
          .update({ numberOfDocs: firestore.FieldValue.increment(1) })
          .then(() => {
            passedIncrementInAnalytics = true;
          })
          .catch((error) => {
            console.log(error);
            passedIncrementInAnalytics = false;
          });

        if (passedIncrementInAnalytics) {
          await firestore()
            .collection("UserInfos")
            .doc(user.uid)
            .update({ userType: "PremiumClient" })
            .then(async () => {
              setIsLoading(false);
              confirm = await asyncAlert(
                "Upgrade de conta",
                "Conta premium adquirida com sucesso."
              );
              navigation.goBack();
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
              return Alert.alert(
                "Upgrade de conta",
                "Desculpe, não conseguimos conexão com o servidor, tente novamente mais tarde ou entre em contato."
              );
            });
        } else {
          setIsLoading(false);
          Alert.alert(
            "Upgrade de conta",
            "Desculpe, não conseguimos conexão com o servidor, tente novamente mais tarde ou entre em contato."
          );
        }
      } else {
        setIsLoading(false);
        Alert.alert(
          "Upgrade de conta",
          "Desculpe, não conseguimos confirmar seu pagamento."
        );
      }
    } else {
      setIsLoading(false);
    }
    passedIncrementInAnalytics = false;
    confirmBuyPremium = false;
    confirmPremiumPayment = false;

    /*if (confirmed == true) {
      await firestore()
        .collection("Analytics")
        .doc("IngredientsCount")
        .update({ numberOfDocs: firestore.FieldValue.increment(-1) })
        .then(() => {
          passedIncrementInAnalytics = true;
        })
        .catch((error) => {
          console.log(error);
          passedIncrementInAnalytics = false;
        });

      if (passedIncrementInAnalytics) {
        await firestore()
          .collection("Ingredients")
          .doc(id)
          .delete()
          .then(() => {
            Alert.alert("Ingrediente", "Ingrediente removido com sucesso.");
          })
          .catch((error) => {
            console.log(error);

            return Alert.alert(
              "Ingrediente",
              "Não foi possível remover o ingrediente."
            );
          });
      } else {
        setIsLoading(false);
      }
    }
    confirmBuyPremium = false;*/
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title={"Upgrade de Conta"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1}>
          <Heading
            color="gray.100"
            fontSize={"xl"}
            mt={8}
            ml={2}
            textAlign={"center"}
          >
            Obtendo nossa conta premium você receberá:
          </Heading>
          <Heading
            color="gray.100"
            mt={4}
            ml={2}
            alignSelf={"flex-start"}
            fontSize={"xl"}
            textAlign={"left"}
          >
            - Recomendações de especialistas personalizadas em cada produto
            escaneado, com base nas suas condições de saúde.
          </Heading>
          <Heading
            color="gray.100"
            mt={4}
            ml={2}
            alignSelf={"flex-start"}
            fontSize={"xl"}
            textAlign={"left"}
          >
            - Remoção dos anúncios no aplicativo.
          </Heading>

          <Heading
            color="gray.100"
            mt={4}
            ml={2}
            mb={8}
            fontSize={"xl"}
            textAlign={"center"}
          >
            Pacote mensal: 20,00 R$.
          </Heading>
          {/*
          <Input
            mt={5}
            placeholder="Nome completo"
            value={userCompleteName}
            onChangeText={(completeName) => {
              handleUserCompleteName(completeName);
            }}
          />
          <Input
            placeholder="Idade"
            mt={5}
            mb={8}
            value={userAge}
            onChangeText={(age) => {
              handleUserAge(age);
            }}
            keyboardType="numeric"
          />
          */}
        </Center>
      </ScrollView>

      <Button
        title="Adquirir Premium"
        mt={5}
        isLoading={isLoading}
        onPress={handleBuyPremium}
      />
    </VStack>
  );
}
