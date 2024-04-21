// components/MainPane.tsx
import { type FC, useEffect, useState } from "react";

import { Box, Flex, Heading, Text, Button, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { readContract, readContracts } from "@wagmi/core";
import { erc20Abi, formatUnits, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import addresses from "@/addresses";
import creditModule from "@/app/abi/creditModule.json";
import { InfoText } from "@/components";
import { useNotify } from "@/hooks";
import styles from "@/styles/mainPane.module.css";
import { wagmiConfig } from "@/wagmi";

const RealDemo: FC = () => {
  const { address } = useAccount();
  // const sdai_address = addresses["SDAI"];
  const wsteth_address = addresses["WSTETH"];

  const credit_module = addresses["CREDIT_MODULE"];
  const eure_receiver = addresses["EURe_RECEIVER"];
  const [amountInWallet, setAmountInWallet] = useState<string>("0");
  const { data, error, isPending, isError, writeContract } = useWriteContract();
  const { data: receipt, isLoading } = useWaitForTransactionReceipt({ hash: data });
  const { notifyError, notifySuccess } = useNotify();
  const coffeeEURAmount = "0.05";
  const [selectedCurrency, setSelectedCurrency] = useState<string>(wsteth_address);
  const [conversionRate, setConversionRate] = useState<any>();
  const [canSafePay, setCanSafePay] = useState<boolean>(false);
  const [isApproveNeeded, setIsApproveNeeded] = useState<boolean>(true);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: wsteth_address as `0x${string}`,
      functionName: "allowance",
      args: [address as `0x${string}`, credit_module as `0x${string}`],
    }).then((result) => {
      const parsed = parseFloat(formatUnits(result, 18));
      if (parsed) {
        if (parseFloat(coffeeEURAmount) > parseFloat(formatUnits(result, 18))) {
          setIsApproveNeeded(true);
        } else {
          setIsApproveNeeded(false);
        }
      } else if (parsed === 0) {
        setIsApproveNeeded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (receipt) {
      notifySuccess({
        title: `TX successfully sent!`,
        message: `Hash: ${receipt.transactionHash}`,
      });
    }

    if (isError && error) {
      notifyError({
        title: "An error occured:",
        message: error.message,
      });
    }
  }, [receipt, isError, error, notifyError, notifySuccess]);

  const handleCanSafePay = () => {
    setIsLocking(true);
    readContracts(wagmiConfig, {
      contracts: [
        {
          address: credit_module as `0x${string}`,
          // @ts-expect-error: data will be full
          abi: creditModule,
          functionName: "canSafePay",
          args: [address, parseEther(coffeeEURAmount)],
        },
      ],
    }).then((result) => {
      if (result[0]) {
        const arr: any = result[0].result;
        // console.log("arr", arr);
        setConversionRate(arr[2]);
        setSelectedCurrency(arr[1]);
        // setIsLocking to false with time delay of 1.2 second
        setTimeout(() => {
          setIsLocking(false);
          setCanSafePay(arr[0]);
        }, 1200);
      }
    });
  };

  const handleApprove = () => {
    writeContract({
      abi: erc20Abi,
      address: selectedCurrency as `0x${string}`,
      functionName: "approve",
      args: [credit_module as `0x${string}`, parseEther("100")],
    });
  };

  const handleCoffee = () => {
    // if (receiver.length === 0 || !isAddress(receiver)) {
    //   return notifyError({
    //     title: "Error:",
    //     message: "The receiver address is not set!",
    //   });
    // }

    writeContract({
      abi: creditModule,
      address: credit_module as `0x${string}`,
      functionName: "pay",
      args: [
        address,
        parseEther(coffeeEURAmount),
        selectedCurrency as `0x${string}`,
        eure_receiver as `0x${string}`,
        conversionRate,
      ],
    });
    setTimeout(() => {
      setIsPaid(true);
    }, 1500);
  };

  useEffect(() => {
    readContracts(wagmiConfig, {
      contracts: [
        {
          address: wsteth_address as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        },
        {
          address: wsteth_address as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        },
      ],
    }).then((result) => {
      if (result[0]) {
        // @ts-expect-error: data will be full
        setAmountInWallet(formatUnits(result[0].result, result[1].result));
      }
    });
  }, [address]);
  return (
    <Box>
      {isApproveNeeded && (
        <Box>
          <Text fontSize={"1.2rem"} mb={8}>
            Kelza Connector needs wstETH allowances to enable instant credit for your purchases
          </Text>
          <Button
            colorScheme={"green"}
            isLoading={isLoading || isPending}
            loadingText={"waiting for approval on safe"}
            onClick={handleApprove}
          >
            Activate wstETH on your Card
          </Button>
        </Box>
      )}
      {!isApproveNeeded && (
        <Box>
          <Text fontSize={"1.2rem"} mb={8}>
            Kelza Connector will pay for your coffee to enable instant credit for your purchases
          </Text>
          <Flex justifyContent={"center"} gap={4} alignItems={"center"}>
            <InfoText label={"wstETH Balance"} value={amountInWallet} />
            {canSafePay ? (
              <Button
                isLoading={isLoading || isPending}
                colorScheme={"green"}
                loadingText={"waiting for transaction execution on safe"}
                isDisabled={isPaid}
                onClick={handleCoffee}
              >
                {isPaid ? "Your coffee is paid!" : "Buy €0.05 for Coffee with wstETH"}
              </Button>
            ) : (
              <Button
                isLoading={isLocking}
                colorScheme={"green"}
                loadingText={"Locking the quote"}
                onClick={handleCanSafePay}
              >
                Lock quote of €0.1 for Coffee with wstETH
              </Button>
            )}
          </Flex>
        </Box>
      )}
      {!isLocking && conversionRate && selectedCurrency && (
        // hacky approach for getting 1euro conversion rate to 0.1euro by decimal manipulation
        <Box>
          Purchase {coffeeEURAmount} EUR for {formatUnits(conversionRate, 19)} is locked!
        </Box>
      )}
    </Box>
  );
};

const NotSafe: FC = () => {
  return <Box>You are not connected with SAFE, please switch to SAFE account!</Box>;
};
const DemoPane: FC = () => {
  const { isConnected, connector } = useAccount();
  const { colorMode } = useColorMode();

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Kelza Connector Demo
      </Heading>

      <Box px={12}></Box>

      <Flex className={styles.content}>
        {isConnected ? (
          connector?.id == "safe" ? (
            <RealDemo />
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

export default DemoPane;
