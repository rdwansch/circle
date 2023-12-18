import { Box, Button, Flex, Icon, Text, useColorMode } from "@chakra-ui/react";
import { RiHome7Fill } from "react-icons/ri";
import {
  BsFillPersonFill,
  BsFillHeartFill,
  BsPersonCircle,
  BsFillMoonFill,
  BsFillSunFill,
} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

export default function SideNav() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={5}
      justifyContent="space-between"
      w="300px"
      h="100vh"
      pos="fixed"
      px={10}
      py={5}
      borderRight="gray"
      borderRightWidth={1}
      borderRightStyle="solid"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" gap={2}>
          <Text fontSize="5xl" color="#04a51e" fontWeight="bold">
            circle
          </Text>
          <Button
            onClick={toggleColorMode}
            bg="transparent"
            _hover={{
              bg: "transparent",
            }}
          >
            <Icon as={colorMode == "dark" ? BsFillMoonFill : BsFillSunFill} />
          </Button>
        </Flex>

        <Flex flexDirection="column" gap={5}>
          <Flex alignItems="center" gap={2}>
            <Icon as={RiHome7Fill} />
            <Text>Home</Text>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsFillPersonFill} />
            <Text>Search</Text>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsFillHeartFill} />
            <Text>Search</Text>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsPersonCircle} />
            <Text>Profile</Text>
          </Flex>

          <Button
            bgColor="#04a51e"
            rounded="full"
            color="white"
            fontWeight="semibold"
            _hover={{ bg: "#019119" }}
          >
            Create Post
          </Button>
        </Flex>
      </Flex>

      <Flex alignItems="center" gap={2}>
        <Icon as={BiLogOut} />
        <Text>Logout</Text>
      </Flex>
    </Box>
  );
}
