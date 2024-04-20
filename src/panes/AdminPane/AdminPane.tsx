// components/MainPane.tsx
import { type FC, useState } from "react";

import { Box, Button, Flex, Heading, useColorMode, Text } from "@chakra-ui/react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";

import styles from "@/styles/mainPane.module.css";

const AdminPane: FC = () => {
  // const { isConnected } = useAccount();
  const { colorMode } = useColorMode();
  const [schemaId, setSchemaId] = useState("");

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.gnosis,
  });
  const handleSchemaCreation = () => {
    client
      .createSchema({
        name: "NextPay Service Agreement",
        resolver: "0xEdc4fF459aC4eF05Be2E97629617A1cD4a799dEA",
        data: [
          {
            name: "service",
            type: "uint256",
          },
          {
            name: "spendLimit",
            type: "uint256",
          },
          {
            name: "originalSafe",
            type: "address",
          },
          {
            name: "connectedSafe",
            type: "address",
          },
        ],
      })
      .then((res) => {
        console.log(res);
        setSchemaId(res.schemaId);
        // client.sign(res.attestationId).then((res) => {
        //     console.log(res);
        // });
      });
  };

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Keza Admin
      </Heading>

      <Box px={12}></Box>

      <Flex className={styles.content}>
        <Button onClick={handleSchemaCreation}>Create Schema</Button>

        <Text>Created Schema: {schemaId}</Text>
      </Flex>
    </Box>
  );
};

export default AdminPane;
