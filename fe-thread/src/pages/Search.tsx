import { Box, Button, Flex, Icon, Image, Input, Text } from "@chakra-ui/react";
import SideNav from "../components/SideNav";
import { BsSearch } from "react-icons/bs";
import { ChangeEvent, useEffect, useState } from "react";
import { API } from "../libs/API";
import { UserType } from "../types/User";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";

export default function Search() {
  const auth = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUser, setFilteredUser] = useState<UserType[]>([]);

  const getUsers = async () => {
    const res = await API.get("/v1/user/findAll");
    setUsers(res.data.data);
    setFilteredUser(res.data.data);
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputUser = e.target.value;

    const filtered = users.filter(u =>
      u.full_name
        .toLowerCase()
        .startsWith(inputUser.toLowerCase().substring(0, 1))
    );

    setFilteredUser(filtered);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <SideNav />
      <Box ml="300px" display="flex" gap={5}>
        <Box w="700px" p={5}>
          <Flex alignItems="center" gap={5} mb={10}>
            <Icon as={BsSearch} />
            <Input
              variant="flushed"
              placeholder="Search Username"
              onChange={handleSearch}
            ></Input>
          </Flex>

          {filteredUser.length !== 0 &&
            filteredUser
              .filter(u => u.id !== auth.id)
              .map(fu => (
                <Flex
                  gap={3}
                  w={400}
                  py={3}
                  _notLast={{
                    borderBottomColor: "gray.700",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                  }}
                  key={fu.username + fu.full_name}
                >
                  <Image
                    src={fu.profile_picture || "/avatar_placeholder.png"}
                    objectFit="cover"
                    alt={fu.username}
                    boxSize={10}
                    rounded="full"
                  />
                  <Flex flexDirection="column" fontSize="sm">
                    <Text>{fu.full_name}</Text>
                    <Text color="gray.500">@{fu.username}</Text>
                  </Flex>

                  <Button
                    bgColor="transparent"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderStyle="solid"
                    h={5}
                    display="block"
                    ml="auto"
                    mt={2}
                    rounded="full"
                    fontSize="xs"
                    fontWeight="normal"
                    color="gray.200"
                  >
                    <Link to={`/profile/${fu.id}`}>View Profile</Link>
                  </Button>
                </Flex>
              ))}
        </Box>
      </Box>
    </>
  );
}
