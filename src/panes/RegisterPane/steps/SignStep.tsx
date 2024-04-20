import { useState } from "react";

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

import logo from "../../../../public/img/eth_sign_logo.png";

export const SignStep = (props: { service: any; spendLimit: any; goToPrevious: any }) => {
  const { address } = useAccount();
  const [attestationID, setAttestationID] = useState("");
  // useEffect(() => {
  //     console.log("methods", watch("service"));
  //     console.log("methods", watch());
  // }, []);

  // const {watch} = methods
  const amount = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(props.spendLimit * 10);
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.gnosis,
    // account: privateKeyToAccount(privateKey), // optional
  });

  const handleSign = () => {
    let uintService = 1;
    if (props.service == "gnosis") {
      uintService = 1;
    } else {
      uintService = 2;
    }
    console.log("service", uintService);
    client
      .createAttestation({
        schemaId: "0x5",
        data: {
          service: uintService,
          spendLimit: props.spendLimit * 100,
          originalSafe: address,
          connectedSafe: address,
        },
        indexingValue: address as string,
      })
      .then((res) => {
        console.log(res);
        setAttestationID(res.attestationId);
        // client.sign(res.attestationId).then((res) => {
        //     console.log(res);
        // });
      });
  };

  return (
    <Flex p={4} sx={{ flexDir: "column", alignItems: "center" }}>
      {/*<Box sx={{p: 8}}>*/}
      {/*    <GiRocketFlight size={64}/>*/}
      {/*</Box>*/}
      <Heading>Overview!</Heading>
      <br />
      <Heading size={"md"}>Review your selected options</Heading>
      <Text>
        {" "}
        You have selected{" "}
        <Text as={"b"} textTransform={"capitalize"}>
          {props.service}
        </Text>{" "}
        service
      </Text>
      <Text>
        {" "}
        You have selected{" "}
        <Text as={"b"} textTransform={"capitalize"}>
          {amount}
        </Text>{" "}
        spend limit
      </Text>
      <br />
      <Image src={logo.src} alt="eth sign logo" width={45} height={45} />
      <Text as={"i"}> Powered by Sign protocol</Text>
      <Text as={"i"}>
        {" "}
        You can check the Schema here:{" "}
        <Link
          style={{ textDecoration: "underline" }}
          href={"https://scan.sign.global/schema/SPS_UjQklwQn47JShOSzIlxHk"}
          target={"_blank"}
        >
          {" "}
          link
        </Link>
        , before you sign
      </Text>
      {/*<Box sx={{mb: 8, mt: 4}}>*/}
      {/*    <Text>You&apos;ve completed the form!</Text>*/}
      {/*</Box>*/}
      <br />
      <br />
      <Flex width="100%" justify="center">
        <Button mr={4} onClick={props.goToPrevious} variant="ghost">
          Prev
        </Button>
        <Button
          isDisabled={attestationID != ""}
          onClick={() => {
            handleSign();
          }}
          type="submit"
        >
          Finish & Sign
        </Button>
      </Flex>
      {attestationID != "" && (
        <Flex>
          Go to your Attestation &nbsp;{" "}
          <Link
            style={{ textDecoration: "underline" }}
            href={`https://scan.sign.global/attestation/${attestationID}`}
            target={"_blank"}
          >
            {" "}
            here{" "}
          </Link>
        </Flex>
      )}
    </Flex>
  );
};
