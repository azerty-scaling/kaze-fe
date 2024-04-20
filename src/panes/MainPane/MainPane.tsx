// components/MainPane.tsx
import { type FC } from "react";

import { Box, Flex, Heading, useColorMode, Text, Button, VStack, HStack } from "@chakra-ui/react";

// import BalanceMoneriumEUR from "@/components/atomicComponents/BalanceMoneriumEUR";
import styles from "@/styles/mainPane.module.css";

const MainPane: FC = () => {
  // const { isConnected } = useAccount();
  const { colorMode } = useColorMode();

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Keza
      </Heading>

      <Box px={12}></Box>

      <Flex className={styles.content}>
        {/*<Status />*/}
        <Text>
          Keza is a decentralized market where it brings Gnosis Pay users who wants to buy now and
          pay later and EURe holders who wants to earn interest on their deposits.
        </Text>
        <br />
        <HStack gap={8}>
          <VStack w={"full"}>
            <Text as={"b"}>Are you Gnosis Pay User?</Text>
            <br />
            <Text>
              You can register and start purchasing with your Gnosis Pay and pay at the end of the
              month.
            </Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Button
              w={"full"}
              mx={6}
              py={8}
              colorScheme={"teal"}
              onClick={() => {
                window.open("/register", "_self");
              }}
              // onClick={handleSignMessage}
              // isLoading={isPending}
              // className="custom-button"
            >
              <Heading size={"md"}>Opt-in</Heading>
            </Button>
          </VStack>
          <VStack w={"full"}>
            <Text as={"b"}>You have EURe?</Text>
            <br />
            {/*<Box>*/}
            {/*    <BalanceMoneriumEUR/>*/}
            {/*</Box>*/}
            <Text>
              You can deposit your EURe to our pool and earn interest on your deposit when Gnosis
              Pay users makes purchases.
            </Text>
            <Text>
              <b>Estimated APY</b>: 9%
            </Text>
            <Text>&nbsp;</Text>
            <Button
              w={"full"}
              mx={6}
              py={8}
              colorScheme={"teal"}
              onClick={() => {
                window.open("/earn", "_self");
              }}
              // onClick={handleSignMessage}
              // isLoading={isPending}
              // className="custom-button"
            >
              <Heading size={"md"}>Deposit</Heading>
            </Button>
          </VStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default MainPane;
