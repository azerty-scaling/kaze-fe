"use client";
import { type FC } from "react";

import { HStack, Heading, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { useWindowSize } from "@/hooks/useWindowSize";

import logo from "../../../public/img/logo_transparent.png";
import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();

  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
      borderBottom={"1px solid #F4A896"}
    >
      <HStack alignItems={"flex-end"}>
        <HStack
          onClick={() => {
            window.open("/", "_self");
          }}
          cursor={"pointer"}
        >
          <Image src={logo.src} alt="logo" width={45} height={45} />
          {!isTablet && (
            <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
              NextPay
            </Heading>
          )}
        </HStack>
        <HStack pl={2}>
          {!isTablet && (
            <Button
              fontSize={"1rem"}
              colorScheme={"teal"}
              variant={"ghost"}
              onClick={() => window.open("/register", "_self")}
            >
              Opt-In
            </Button>
          )}
          {!isTablet && (
            <Button
              fontSize={"1rem"}
              colorScheme={"teal"}
              variant={"ghost"}
              onClick={() => window.open("/earn", "_self")}
            >
              Earn
            </Button>
          )}
          {!isTablet && (
            <Button
              fontSize={"1rem"}
              colorScheme={"teal"}
              variant={"ghost"}
              onClick={() => window.open("/demo", "_self")}
            >
              Payment Demo
            </Button>
          )}
        </HStack>
      </HStack>

      <HStack>
        <ConnectButton />
        <DarkModeButton />
      </HStack>
    </HStack>
  );
};

export default Header;
