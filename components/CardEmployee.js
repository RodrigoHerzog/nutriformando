import { Alert } from "react-native";
import {
  HStack,
  Text,
  useTheme,
  VStack,
  Pressable,
  Icon,
  IconButton,
  Heading,
  Divider,
} from "native-base";
import firestore from "@react-native-firebase/firestore";
import { Trash, PencilSimple } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

export function CardEmployee({ data }, ...rest) {
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
        "Funcionário",
        "Deseja remover o funcionário?",
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

  function editEmployee(data, id) {
    console.log("Navigate to Edit Employee");
    /*navigation.navigate({
      name: "Edit Employee",
      params: { userData: data, UserID: id },
      merge: true,
    });*/
  }

  async function removeEmployee(id) {
    confirmed = await asyncConfirmAlert();
    if (confirmed == true) {
      await firestore()
        .collection("Analytics")
        .doc("EmployeesCount")
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
          .collection("UserInfos")
          .doc(id)
          .delete()
          .then(() => {
            Alert.alert("Funcionário", "Funcionário removido com sucesso.");
          })
          .catch((error) => {
            console.log(error);

            return Alert.alert(
              "Funcionário",
              "Não foi possível remover o funcionário."
            );
          });
      } else {
        return Alert.alert(
          "Funcionário",
          "Não foi possível remover o funcionário."
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
                removeEmployee(data.UserID);
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
            <VStack>
              <Heading
                mx={"1/6"}
                textAlign={"center"}
                color="white"
                fontSize="lg"
              >
                {capitalizeFirst(data.userCompleteName)}
              </Heading>
              <Divider
                alignSelf={"center"}
                my={2}
                w={"1/2"}
                bgColor={"green.500"}
              />
              <Text mx={"1/6"} textAlign={"center"} color="white" fontSize="lg">
                Idade: {data.userAge}
              </Text>
              <Text mx={"1/6"} textAlign={"center"} color="white" fontSize="lg">
                Cargo: {data.userType}
              </Text>
            </VStack>
            <IconButton
              icon={
                <Icon
                  as={<PencilSimple color={colors.gray[100]} />}
                  name="editar"
                />
              }
              onPress={() => {
                editEmployee(data, data.UserID);
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
