// components/MainPane.tsx
import { type FC } from "react";

import { Box, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { RegistrationStepper } from "@/panes/RegisterPane/RegistrationStepper";
import styles from "@/styles/mainPane.module.css";
const NotSafe: FC = () => {
  return <Box>You are not connected with SAFE, please switch to SAFE account!</Box>;
};

const RegisterFlow: FC = () => {
  return (
    <Box>
      <Text>Thanks for choosing Kaze</Text>
      <Text>Registering with Kaze is easy. </Text>
      <RegistrationStepper variant={"simple"} />
    </Box>
  );
};
const RegisterPane: FC = () => {
  const { isConnected, connector } = useAccount();
  const { colorMode } = useColorMode();

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Keza Register
      </Heading>

      <Box px={12}></Box>

      <Flex className={styles.content}>
        {isConnected ? (
          connector?.id == "io.metamask" ? (
            <RegisterFlow />
          ) : (
            <NotSafe />
          )
        ) : (
          <Box>
            <Text>Connect your SAFE to use this feature</Text>
            <Flex mt={8} w="full" justifyContent={"center"} alignItems={"center"}>
              <ConnectButton />
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default RegisterPane;
