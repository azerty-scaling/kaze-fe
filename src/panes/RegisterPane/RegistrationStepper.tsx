"use client";
import {
  Box,
  Button,
  Flex,
  Step,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useColorModeValue,
  useSteps,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { SignStep } from "./steps/SignStep";
import { Step1, Step1Schema } from "./steps/Step1";
import { Step2, Step2Schema } from "./steps/Step2";
import { Step3, Step3Schema } from "./steps/Step3";
// import { Step4, Step4Schema } from "./Step4";

const steps = [
  { label: "Step 1", description: "Select Service", content: <Step1 /> },
  { label: "Step 2", description: "Spend Limit", content: <Step2 /> },
  { label: "Step 3", description: "Connected safe", content: <Step3 /> },
  { label: "Step 4", description: "Overview", content: <></> },
  // { label: "Step 3", description: "Sign", content: <SignStep /> },
  // { label: "Step 4", description: "Goal", content: <Step4 /> },
];

const INITIAL_VALUES = {
  service: "",
  spendLimit: 0,
  goal: "",
  connectedSafe: "",
  signed: false,
};

export type FormValues = typeof INITIAL_VALUES;

const schemaArr = [Step1Schema, Step2Schema, Step3Schema];

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        p: 2,
        rounded: "md",
        boxShadow: "sm",
        bg: useColorModeValue("gray.50", "gray.800"),
      }}
    >
      <Text fontSize="md" color="red.400" fontWeight={"bold"}>
        {message}
      </Text>
    </Box>
  );
};

export const RegistrationStepper = ({
  variant,
}: {
  variant: "circles" | "circles-alt" | "simple" | undefined;
}) => {
  const { goToNext, goToPrevious, activeStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const methods = useForm<FormValues>({
    // @ts-expect-error adddd
    resolver: yupResolver(schemaArr[activeStep]),
    defaultValues: INITIAL_VALUES,
  });

  const { handleSubmit } = methods;

  const onSubmit = () => {
    if (activeStep === steps.length - 1) {
      // handle submission here
    }
    goToNext();
  };

  // const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box sx={{ mt: 8 }}>
      <FormProvider {...methods}>
        <Stepper variant={variant} index={activeStep} colorScheme="teal">
          {steps.map(({ label, description }) => (
            <Step key={label}>
              <StepIndicator>
                <StepStatus complete={`✅`} incomplete={`⏳`} active={`📍`} />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{description}</StepTitle>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {(activeStep !== steps.length || activeStep !== steps.length - 1) &&
          steps[activeStep].content}
      </FormProvider>
      {activeStep === steps.length - 1 ? (
        <SignStep
          service={methods.getValues("service")}
          spendLimit={methods.getValues("spendLimit")}
          goToPrevious={goToPrevious}
          connectedSafe={methods.getValues("connectedSafe")}
        />
      ) : (
        <Flex width="100%" justify="center">
          <Button isDisabled={activeStep === 0} mr={4} onClick={goToPrevious} variant="ghost">
            Prev
          </Button>
          <Button onClick={() => handleSubmit(onSubmit)()} type="submit">
            {activeStep === steps.length ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
      {/*<Box as="pre" rounded="md" width="100%" p={4} mt={8}>*/}
      {/*    <code>{JSON.stringify(methods.watch(), null, 2)}</code>*/}
      {/*</Box>*/}
    </Box>
  );
};
