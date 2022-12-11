import {
  Divider,
  Heading,
  HStack,
  IconButton,
  useTheme,
  VStack,
} from "native-base";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { version } from "react";

export function Header({ title, ...rest }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pb={6}
        pt={12}
        {...rest}
      >
        <IconButton
          icon={<CaretLeft color={colors.gray[200]} size={24} />}
          onPress={handleGoBack}
        />

        <Heading
          pb={6}
          pt={12}
          w={"full"}
          zIndex={-1}
          alignSelf={"center"}
          position={"absolute"}
          color="gray.100"
          textAlign="center"
          fontSize="lg"
          flex={1}
        >
          {title}
        </Heading>
      </HStack>
      <Divider bgColor={"green.500"} />
    </VStack>
  );
}
