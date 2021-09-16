import React from "react";
import { Box, Container, HStack, Link } from "@chakra-ui/react";

import { HeaderMenu } from "./index";

const Header = (): JSX.Element => (
  <Box bg="#99CED4" h="16">
    <Container maxW="container.lg" h="100%">
      <HStack justify="space-between" h="100%">
        <Link
          href="/"
          fontSize="4xl"
          fontWeight="bold"
          color="gray.100"
          _hover={{ textDecoration: "none" }}
        >
          BiFB
        </Link>
        <HeaderMenu />
      </HStack>
    </Container>
  </Box>
);

export default Header;