"use client";
import { Box, Heading } from "@chakra-ui/layout";
import { RadioGroup, Stack, Text, useRadioGroup } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";
import { GiOwl, GiCrossedChains } from "react-icons/gi";
import * as yup from "yup";

import { RadioCard } from "./RadioCard";
import { ErrorMessage, type FormValues } from "../RegistrationStepper";

export const Step1Schema = yup.object().shape({
  service: yup.string().required("This value is required."),
});

const options = [
  { label: "Use stETH on Gnosis as Collateral", value: "gnosis", icon: GiOwl },
  { label: "Use stETH on Arbitrum as Collateral", value: "arbitrum", icon: GiCrossedChains },
];

export const Step1 = () => {
  const { control } = useFormContext<FormValues>();

  const {
    field,
    formState: { errors },
  } = useController({
    name: "service",
    control,
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "service",
    defaultValue: field.value,
    onChange: field.onChange,
  });

  const group = getRootProps();

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
        What are you looking for?
      </Heading>
      <Text sx={{ mt: 4 }}>Select a service below to get started.</Text>
      <RadioGroup mb={4} name="Step1" defaultValue={field.value} sx={{ mt: 8 }}>
        <Stack {...group} spacing={4} direction="row">
          {options.map(({ value, label, icon }) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard icon={icon} key={value} {...radio}>
                {label}
              </RadioCard>
            );
          })}
        </Stack>
      </RadioGroup>
      {errors.service && <ErrorMessage message={errors.service.message || ""} />}
    </Box>
  );
};
