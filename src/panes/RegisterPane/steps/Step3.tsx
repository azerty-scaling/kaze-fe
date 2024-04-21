import { Box, Heading } from "@chakra-ui/layout";
import { Flex, Input, Text } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";
import { useAccount } from "wagmi";
import * as yup from "yup";

import { ErrorMessage, type FormValues } from "../RegistrationStepper";

export const Step3Schema = yup.object().shape({
  spendLimit: yup.string().required("This value is required."),
});

export const Step3 = () => {
  const { control } = useFormContext<FormValues>();
  const { address } = useAccount();

  const {
    field,
    formState: { errors },
  } = useController({
    name: "connectedSafe",
    control,
    defaultValue: address,
  });

  return (
    <Box
      sx={{
        mb: 8,
        display: "flex",
        flexDir: "column",
        alignItems: "center",
      }}
    >
      <Heading size="lg" sx={{ mt: 8 }}>
        Connected crosschain safe
      </Heading>
      <Text sx={{ my: 4 }}>You can go to next step if you selected gnosis</Text>
      <Flex sx={{ minH: "126px", width: "100%" }}>
        <Input value={field.value} onChange={field.onChange} />
      </Flex>
      {errors.connectedSafe && <ErrorMessage message={errors.connectedSafe.message || ""} />}
    </Box>
  );
};
