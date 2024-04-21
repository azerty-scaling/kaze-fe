"use client";
import { Box, Heading } from "@chakra-ui/layout";
import { Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";
import * as yup from "yup";

import { ErrorMessage, type FormValues } from "../RegistrationStepper";

export const Step2Schema = yup.object().shape({
  spendLimit: yup.number().min(1, "Must be greater than 0.").required("This value is required."),
});

export const Step2 = () => {
  const { control } = useFormContext<FormValues>();

  const {
    field,
    formState: { errors },
  } = useController({
    name: "spendLimit",
    control,
    defaultValue: 0,
  });

  const amount = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(field.value * 10);

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
        Estimated monthly spend credit
      </Heading>
      <Text sx={{ my: 4 }}>Use the slider to enter the spend limit.</Text>
      <Heading>{amount}</Heading>
      <Flex sx={{ minH: "126px", width: "100%" }}>
        <Slider
          id="slider"
          min={0}
          max={100}
          value={field.value}
          maxWidth={["100%", "65%"]}
          colorScheme="blue"
          onChange={field.onChange}
          sx={{ mx: "auto" }}
        >
          <SliderTrack sx={{ height: 1.5 }}>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
      </Flex>
      {errors.spendLimit && <ErrorMessage message={errors.spendLimit.message || ""} />}
    </Box>
  );
};
