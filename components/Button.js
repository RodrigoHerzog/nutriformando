import { Button as ButtonNativeBase, Heading } from "native-base";

export function Button({ title, ...rest }) {
  return (
    <ButtonNativeBase
      bg="green.700"
      h={14}
      fontSize="sm"
      rounded="sm"
      _pressed={{ bg: "green.500" }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}
