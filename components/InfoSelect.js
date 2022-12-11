import { Box, useTheme, Select } from "native-base";
import { Check, CaretUp, CaretDown } from "phosphor-react-native";

export function InfoSelect({ data, ...rest }) {
  const { colors } = useTheme();

  return (
    <Select
      pl={5}
      alignSelf={"center"}
      bg="green.700"
      h={14}
      size="md"
      borderWidth={0}
      dropdownCloseIcon={
        <Box mr={5}>
          <CaretDown color="white" />
        </Box>
      }
      dropdownOpenIcon={
        <Box mr={5}>
          <CaretUp color="white" />
        </Box>
      }
      fontSize="md"
      fontFamily="body"
      color="gray.100"
      rounded="sm"
      placeholderTextColor="gray.100"
      _selectedItem={{
        bg: "gray.100",
        endIcon: <Check color={colors.gray[700]} />,
      }}
      {...rest}
    >
      {data.map((nutriInfo) => (
        <Select.Item
          label={nutriInfo[0]}
          key={nutriInfo[1]}
          value={nutriInfo[1]}
        />
      ))}
    </Select>
  );
}
