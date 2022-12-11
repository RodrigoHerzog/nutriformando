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

export function CardIngredient({ data }, ...rest) {
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
        "Ingrediente",
        "Deseja remover o ingrediente?",
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

  function editIngredient(name, id) {
    navigation.navigate({
      name: "Edit Ingredient",
      params: { ingName: name, ingID: id },
      merge: true,
    });
  }

  async function removeIngredient(id) {
    confirmed = await asyncConfirmAlert();
    if (confirmed == true) {
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
        return Alert.alert(
          "Ingrediente",
          "Não foi possível remover o ingrediente."
        );
      }
    }
    confirmed = false;
  }

  console.log(data);

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
                removeIngredient(data.IngId);
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
              {capitalizeFirst(data.Ingredient)}
            </Text>
            <IconButton
              icon={
                <Icon
                  as={<PencilSimple color={colors.gray[100]} />}
                  name="editar"
                />
              }
              onPress={() => {
                editIngredient(data.Ingredient, data.IngId);
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
