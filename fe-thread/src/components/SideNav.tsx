import { Box, Button, Flex, Icon, Text, useColorMode } from "@chakra-ui/react";
import { RiHome7Fill } from "react-icons/ri";
import { BsFillPersonFill, BsFillHeartFill, BsPersonCircle, BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import cookie from "../utils/cookie";
import { useDispatch } from "react-redux";
import { removeSession } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../libs/API";

export default function SideNav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const c = confirm("You will logout?");
    if (c) {
      cookie.remove("token");
      dispatch(removeSession());
      delete API.defaults.headers.common["Authorization"];
      navigate("/login");
    }
  };

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
        </Flex>

        <Flex flexDirection="column" gap={5}>
          <Flex alignItems="center" gap={2}>
            <Icon as={RiHome7Fill} />
            <Link to="/threads">Home</Link>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsFillPersonFill} />
            <Link to="/search">Search</Link>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsFillHeartFill} />
            <Link to="/follows">Follows</Link>
          </Flex>

          <Flex alignItems="center" gap={2}>
            <Icon as={BsPersonCircle} />
            <Link to="/profile">Profile</Link>
          </Flex>

          <Button bgColor="#04a51e" rounded="full" color="white" fontWeight="semibold" _hover={{ bg: "#019119" }}>
            Create Post
          </Button>
        </Flex>
      </Flex>

      <Button onClick={handleLogout} bg="transparent">
        <Flex alignItems="center" gap={2}>
          <Icon as={BiLogOut} />
          <Text>Logout</Text>
        </Flex>
      </Button>
    </Box>
  );
}
