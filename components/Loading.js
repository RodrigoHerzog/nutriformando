import { Center, Spinner, VStack } from "native-base";

export function Loading(...rest) {
  return (
    <Center flex={1} bg="gray.600" {...rest}>
      <Spinner color="secondary.700" />
    </Center>
  );
}
