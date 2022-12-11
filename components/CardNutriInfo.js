import { Alert } from "react-native";
import {
  HStack,
  Text,
  useTheme,
  VStack,
  Pressable,
  Icon,
  IconButton,
} from "native-base";
import firestore from "@react-native-firebase/firestore";
import { Trash, PencilSimple } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

export function CardNutriInfo({ data }, ...rest) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  var passedIncrementInAnalytics,
    confirmed = false;
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const asyncConfirmAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Informação Nutricional",
        "Deseja remover a informação nutricional?",
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
          cancelable: true,
          onDismiss: () => resolve(false),
        }
      );
    });
  };

  function editNutriInfo(name, id) {
    navigation.navigate({
      name: "Edit NutriInfo",
      params: { NutInfName: name, NutInfID: id },
      merge: true,
    });
  }

  async function removeNutriInfo(id) {
    confirmed = await asyncConfirmAlert();
    if (confirmed == true) {
      await firestore()
        .collection("Analytics")
        .doc("NutriInfosCount")
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
          .collection("NutriInfos")
          .doc(id)
          .delete()
          .then(() => {
            Alert.alert(
              "Informação Nutricional",
              "Informação nutricional removida com sucesso."
            );
          })
          .catch((error) => {
            console.log(error);

            return Alert.alert(
              "Informação Nutricional",
              "Não foi possível remover a informação nutricional."
            );
          });
      } else {
        return Alert.alert(
          "Informação Nutricional",
          "Não foi possível remover a informação nutricional."
        );
      }
    }
    confirmed = false;
  }

  return (
    <Pressable {...rest}>
      <HStack
        borderColor="green.500"
        borderWidth={"1"}
        bg="gray.500"
        my={2}
        rounded="sm"
        overflow="hidden"
      >
        <VStack flex={1} m={3} my={4}>
          <HStack rounded="sm" alignItems={"center"} justifyContent={"center"}>
            <IconButton
              icon={
                <Icon as={<Trash color={colors.gray[100]} />} name="excluir" />
              }
              onPress={() => {
                removeNutriInfo(data.NutInfID);
              }}
              borderRadius="full"
              rounded="full"
              h={10}
              w={10}
              position={"absolute"}
              left={0}
              bg={"green.700"}
              _icon={{
                color: "gray.100",
                size: "md",
              }}
              _hover={{
                bg: "green.500",
              }}
              _pressed={{
                bg: "green.500",
                _icon: {
                  name: "excluir",
                },
              }}
            />

            <Text mx={"1/6"} textAlign={"center"} color="white" fontSize="lg">
              {capitalizeFirst(data.NutriInfo)}
            </Text>
            <IconButton
              icon={
                <Icon
                  as={<PencilSimple color={colors.gray[100]} />}
                  name="editar"
                />
              }
              onPress={() => {
                editNutriInfo(data.NutriInfo, data.NutInfID);
              }}
              borderRadius="full"
              rounded="full"
              h={10}
              w={10}
              position={"absolute"}
              right={0}
              bg={"green.700"}
              _icon={{
                color: "gray.100",
                size: "md",
              }}
              _hover={{
                bg: "green.500",
              }}
              _pressed={{
                bg: "green.500",
                _icon: {
                  name: "editar",
                },
              }}
            />
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
}
