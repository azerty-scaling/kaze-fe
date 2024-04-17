import { type FC, useState, useEffect } from "react";

import {
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { readContract, readContracts } from "@wagmi/core";
import { erc20Abi, erc4626Abi, formatUnits, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import addresses from "@/addresses";
import { useNotify } from "@/hooks";
import { wagmiConfig } from "@/wagmi";

const TransferEURe: FC = () => {
  // const { data, error, isPending, isError, sendTransaction } = useSendTransaction();
  // const { data: receipt, isLoading } = useWaitForTransactionReceipt({ hash: data });
  const { address } = useAccount();
  const eure_vault_address = addresses["EURE_VAULT"];
  const eure_address = addresses["MONERIUM_EURO"];
  const { data, error, isPending, isError, writeContract } = useWriteContract();
  const { data: receipt, isLoading } = useWaitForTransactionReceipt({ hash: data });
  const { notifyError, notifySuccess } = useNotify();
  const [amount, setAmount] = useState<string>("0");
  const [isApproveNeeded, setIsApproveNeeded] = useState<boolean>(true);
  const [actionName, setActionName] = useState<string>("Approve");

  const [amountInWallet, setAmountInWallet] = useState<number>(0);

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
      ],
    }).then((result) => {
      // console.log("result", result);
      if (result[0]) {
        // console.log("result 0", result[0].result);
        // @ts-expect-error: data will be full
        setAmountInWallet(parseFloat(formatUnits(result[0].result, result[1].result)));
      }
    });
  }, [address]);

  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    let text = "";
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount) {
      text = "Enter amount";
    } else if (amountInWallet > parsedAmount) {
      if (isApproveNeeded) {
        text = "Approve";
      } else {
        text = "Deposit";
      }
    } else {
      text = "Insufficient balance";
    }
    setButtonText(text);
  }, [amount, amountInWallet, isApproveNeeded]);

  const handleAmountChange = (valueAsString: string): void => {
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: addresses["MONERIUM_EURO"] as `0x${string}`,
      functionName: "allowance",
      args: [address as `0x${string}`, eure_vault_address as `0x${string}`],
    }).then((result) => {
      const parsed = parseFloat(formatUnits(result, 18));
      if (parsed) {
        if (parseFloat(valueAsString) > parseFloat(formatUnits(result, 18))) {
          setActionName("Approve");
        } else {
          setActionName("Deposit");
        }
        setIsApproveNeeded(parseFloat(valueAsString) > parseFloat(formatUnits(result, 18)));
      } else if (parsed === 0) {
        setActionName("Approve");
        setIsApproveNeeded(true);
      }
    });
    setAmount(valueAsString);
  };

  const handleTransfer = () => {
    // if (receiver.length === 0 || !isAddress(receiver)) {
    //   return notifyError({
    //     title: "Error:",
    //     message: "The receiver address is not set!",
    //   });
    // }

    if (parseFloat(amount) <= 0) {
      return notifyError({
        title: "Error:",
        message: "The amount to send must be greater than 0.",
      });
    }

    writeContract({
      abi: erc4626Abi,
      address: eure_vault_address as `0x${string}`,
      functionName: "deposit",
      args: [parseEther(amount), address as `0x${string}`],
    });
  };

  const handleApprove = () => {
    // if (receiver.length === 0 || !isAddress(receiver)) {
    //   return notifyError({
    //     title: "Error:",
    //     message: "The receiver address is not set!",
    //   });
    // }

    if (parseFloat(amount) <= 0) {
      return notifyError({
        title: "Error:",
        message: "The amount to send must be greater than 0.",
      });
    }

    writeContract({
      abi: erc20Abi,
      address: eure_address as `0x${string}`,
      functionName: "approve",
      args: [eure_vault_address as `0x${string}`, parseEther(amount)],
    });
  };

  useEffect(() => {
    if (receipt) {
      notifySuccess({
        title: `${actionName} successfully sent!`,
        message: `Hash: ${receipt.transactionHash}`,
      });
      setAmount("0");
    }

    if (isError && error) {
      notifyError({
        title: "An error occured:",
        message: error.message,
      });
    }
  }, [receipt, isError, error, notifyError, notifySuccess]);

  return (
    <VStack w={"100%"} minWidth={"270px"} gap={2}>
      {/*<AddressInput receiver={receiver} setReceiver={setReceiver} />*/}

      <HStack>
        <NumberInput
          value={amount}
          min={0}
          onChange={handleAmountChange}
          step={0.00000001}
          precision={8}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Button
          // variant="ghost"
          colorScheme="green"
          isDisabled={!parseFloat(amount) || parseFloat(amount) > amountInWallet}
          onClick={isApproveNeeded ? handleApprove : handleTransfer}
          isLoading={isLoading || isPending}
          className="custom-button"
        >
          {buttonText}
        </Button>
      </HStack>
    </VStack>
  );
};
export default TransferEURe;
