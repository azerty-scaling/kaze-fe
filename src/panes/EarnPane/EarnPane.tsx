// components/MainPane.tsx
import { type FC, useEffect, useState } from "react";

import { Box, Flex, Heading, useColorMode, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { readContracts } from "@wagmi/core";
import { erc20Abi, erc4626Abi, formatUnits } from "viem";
import { useAccount } from "wagmi";

import addresses from "@/addresses";
import { BalanceMoneriumEUR, TransferEURe } from "@/components/atomicComponents";
import styles from "@/styles/mainPane.module.css";
import { wagmiConfig } from "@/wagmi";

const EarnPane: FC = () => {
  const { isConnected, address } = useAccount();
  const eure_lending_pool = addresses["LendingPool"];

  const [amountInLP, setAmountInLP] = useState();

  const { colorMode } = useColorMode();

  useEffect(() => {
    readContracts(wagmiConfig, {
      contracts: [
        {
          address: eure_lending_pool as `0x${string}`,
          abi: erc4626Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        },
        {
          address: eure_lending_pool as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        },
      ],
    }).then((result) => {
      console.log("result", result);
      if (result[0]) {
        // console.log("result 0", result[0].result);
        // @ts-expect-error: data will be full
        setAmountInLP(parseFloat(formatUnits(result[0].result, result[1].result)));
      }
    });
  }, [address]);

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Deposit EURe
      </Heading>

      <Box px={12}></Box>

      <Flex className={styles.content}>
        {/*<Status />*/}
        <Text>Deposit EURe to earn fees from payments.</Text>
        <Text>
          <b>Estimated APY</b>: 10%
        </Text>
        <Text>
          <b>Your Vault Balance</b>: {amountInLP} {amountInLP ? "EURe" : ""}
        </Text>
        <Text></Text>
        <Box>{isConnected ? <BalanceMoneriumEUR /> : null}</Box>
        <Flex w="full" justifyContent={"center"} alignItems={"center"}>
          {isConnected ? <TransferEURe /> : <ConnectButton />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default EarnPane;
