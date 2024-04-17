import { type FC, useState, useEffect } from "react";

import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { readContracts } from "@wagmi/core";
import { erc20Abi, erc4626Abi, formatUnits } from "viem";
import { useAccount } from "wagmi";

import addresses from "@/addresses";
import { InfoText } from "@/components";
import { wagmiConfig } from "@/wagmi";

const PositionDetails: FC = () => {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const eure_vault_address = addresses["EURE_VAULT"];
  const eure_address = addresses["MONERIUM_EURO"];
  const [shares, setShares] = useState<string>("0");
  const [assets, setAssets] = useState<string>("0");

  const [amountInWallet, setAmountInWallet] = useState<string>("0");

  useEffect(() => {
    readContracts(wagmiConfig, {
      contracts: [
        {
          address: eure_address as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        },
        {
          address: eure_address as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        },
        {
          address: eure_vault_address as `0x${string}`,
          abi: erc4626Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        },
      ],
    }).then((result) => {
      // console.log("result", result);
      if (result[0]) {
        // console.log("result 0", result[0].result);
        // @ts-expect-error: data will be full
        setAmountInWallet(formatUnits(result[0].result, result[1].result));
        const shares = result[2].result;
        console.log("shares", shares);
        if (shares) {
          readContracts(wagmiConfig, {
            contracts: [
              {
                address: eure_vault_address as `0x${string}`,
                abi: erc4626Abi,
                functionName: "convertToAssets",
                args: [shares],
              },
            ],
          }).then((result) => {
            if (result) {
              setShares(formatUnits(shares, 18));
              setAssets(formatUnits(result[0].result ? result[0].result : BigInt("0"), 18));
            }
          });
        } else {
          setShares("0");
          setAssets("0");
        }
      }
    });
  }, [address]);

  const checkConnectionAndShares = (isConnected: boolean, shares: string) => {
    if (isConnected) {
      if (shares !== "0") {
        return <VStack></VStack>;
      } else {
        return (
          <Box w={"full"}>
            <Button
              mx={6}
              py={8}
              colorScheme={"green"}
              onClick={() => {
                window.open("/deposit", "_self");
              }}
            >
              <Heading size={"md"}>Deposit</Heading>
            </Button>
          </Box>
        );
      }
    }
    return "";
  };

  return (
    <VStack w={"100%"} minWidth={"270px"} gap={2}>
      {/*<AddressInput receiver={receiver} setReceiver={setReceiver} />*/}

      <VStack>
        <InfoText label="EURe in Wallet" value={amountInWallet} />
        <InfoText label="Shares of Vault" value={shares} />
        <InfoText label="Assets in Vault" value={assets} />
      </VStack>
      {checkConnectionAndShares(isConnected, shares)}
    </VStack>
  );
};
export default PositionDetails;
