"use client";
import { type FC } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { BlockNumber } from "@/components/atomicComponents";

const Footer: FC = () => {
  return (
    <Box as="footer" p={"1rem"} position="sticky" bottom={0} zIndex={10} textAlign={"center"}>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex minW={"400px"}>
          <Link href="https://github.com/Azerty-Scaling" target="_blank" rel="noopener noreferrer">
            Azerty Scaling (c) 2024
          </Link>
        </Flex>
        <BlockNumber />
        <Flex gap={4} alignItems={"baseline"} minH={6}>
          <Flex gap={2}>
            <Text>Frontend: </Text>
            <Link href={"https://github.com/azerty-scaling/kaze_fe"}>
              <FaGithub alignmentBaseline={"before-edge"} size={24} />
            </Link>
          </Flex>
          <Flex gap={2}>
            <Text fontSize={"sm"}>Smart Contracts: </Text>
            <Link href={"https://github.com/azerty-scaling/kaze_sc"}>
              <FaGithub alignmentBaseline={"before-edge"} size={24} />
            </Link>
          </Flex>

          <Link href={"https://github.com/azerty-scaling/kaze_sc"}>
            <Text
              textStyle={{
                textDecoration: "underline",
              }}
              textUnderlineOffset={2}
              fontSize={"sm"}
            >
              Smart contracts are not audited.
            </Text>
            <Text
              textStyle={{
                textDecoration: "underline",
              }}
              textUnderlineOffset={2}
              fontSize={"sm"}
            >
              Use at your own risk.
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
