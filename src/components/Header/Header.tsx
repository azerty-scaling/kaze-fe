"use client";
import { type FC } from "react";

import { HStack, Heading, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

import { useWindowSize } from "@/hooks/useWindowSize";

import logo from "../../../public/img/logo_transparent.png";
import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();
  const { colorMode } = useColorMode();

  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
    >
      <HStack
        onClick={() => {
          window.open("/", "_self");
        }}
        cursor={"pointer"}
      >
        <Image src={logo.src} alt="logo" width={45} height={45} />
        {!isTablet && (
          <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
            Kaze
          </Heading>
        )}
      </HStack>

      <HStack>
        {!isTablet && (
          <Link
            style={{
              textDecoration: "underline",
              paddingRight: "20px",
              color: `${colorMode === "light" ? "#250" : "white"}`,
            }}
            href={"/demo"}
          >
            <Heading as={"h2"} fontSize={"1rem"}>
              Demo
            </Heading>
          </Link>
        )}
        {!isTablet && (
          <Link
            style={{
              textDecoration: "underline",
              paddingRight: "20px",
              color: `${colorMode === "light" ? "#250" : "white"}`,
            }}
            href={"/positions"}
          >
            <Heading as={"h2"} fontSize={"1rem"}>
              Your Positions
            </Heading>
          </Link>
        )}
        <ConnectButton />
        <DarkModeButton />
      </HStack>
    </HStack>
  );
};

export default Header;
