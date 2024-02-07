import { useSelector } from "react-redux";
import { Box, Button, Flex, Icon, Image, Text, useColorMode } from "@chakra-ui/react";
import { RiFacebookCircleFill, RiGithubFill, RiInstagramFill, RiLinkedinBoxFill } from "react-icons/ri";

import { RootState } from "../store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../libs/API";
import { SuggestionType } from "../types/User";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SideProfile() {
  const auth = useSelector((state: RootState) => state.auth);
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<SuggestionType>();
  console.log(auth);
  const queryUserAll = useQuery<AxiosResponse<{ data: SuggestionType[] }>>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await API.get<{ data: SuggestionType[] }>("/v1/user/all");

      const user = res.data.data.filter(u => u.user_id == auth.id);
      setCurrentUser(user);

      return res;
    },
    enabled: true,
  });

  // const handleUnfollow = async (followingId: string) => {
  //   await API.post(`/v1/unfollow/${followingId}`);
  //   await queryClient.invalidateQueries({
  //     queryKey: ["follower", "following"],
  //   });
  //   queryUserAll.refetch();
  // };

  // const handleFollow = async (followingId: string) => {
  //   await API.post("/v1/follows", { followingId });
  //   await queryClient.invalidateQueries({
  //     queryKey: ["follower", "following"],
  //   });
  //   queryUserAll.refetch();
  // };

  return (
    <Box top={0} right={0} w="400px" p={5}>
      <Box bgColor={colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} p={5} rounded="lg">
        <Text fontWeight="semibold" my={2}>
          My Profile
        </Text>
        <Box pos="relative" bgGradient="linear(to-r, green.200, pink.500)" rounded="lg" height={40}>
          <Image
            src={auth.profile_picture || "/avatar_placeholder.png"}
            rounded="full"
            objectFit="cover"
            alt="Dan Abramov"
            pos="absolute"
            bottom={-7}
            left={5}
            boxSize={50}
            borderWidth={2}
            borderColor="gray.700"
            borderStyle="solid"
          />
        </Box>
        <Button
          bgColor="transparent"
          borderWidth={1}
          borderColor="white"
          borderStyle="solid"
          h={7}
          display="block"
          ml="auto"
          mt={2}
          fontWeight="normal"
          rounded="full"
        >
          <Link to={`/profile`}>Edit Profile</Link>
        </Button>
        <Text>{auth.full_name}</Text>
        <Text fontSize="sm" color="gray.500">
          @{auth.username}
        </Text>
        <Text color="gray.300" fontWeight="normal">
          {auth.profile_description}
        </Text>
        <Flex gap={5} mt={2}>
          <Flex>
            <Text>{auth.following.length}</Text>
            <Text color="gray.500">Following</Text>
          </Flex>
          <Flex>
            <Text>23</Text>
            <Text color="gray.500">Followers</Text>
          </Flex>
        </Flex>
      </Box>

      <Box bgColor={colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} p={5} mt={5} rounded="lg">
        <Text fontWeight="semibold">Sugested for you</Text>
        <Flex flexDirection="column" gap={2} mt={5}>
          {!queryUserAll.isPending &&
            queryUserAll.data?.data.data
              .filter(user => user.user_id != auth.id)
              .map(user => (
                <Flex gap={3} key={user.user_username}>
                  <Image
                    src={user?.user_profile_picture || "/avatar_placeholder.png"}
                    objectFit="cover"
                    alt="Dan Abramov"
                    boxSize={10}
                    rounded="full"
                  />
                  <Flex flexDirection="column" fontSize="sm">
                    <Text>{user.user_full_name}</Text>
                    <Text color="gray.500">@{user.user_username}</Text>
                  </Flex>
                  {/* {user.follower_followingId == auth.id ? (
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
                      onClick={() => handleUnfollow(user.user_id + "")}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      bgColor="transparent"
                      borderWidth={1}
                      borderColor="gray.400"
                      borderStyle="solid"
                      h={5}
                      display="block"
                      ml="auto"
                      mt={2}
                      rounded="full"
                      fontSize="xs"
                      fontWeight="normal"
                      color="gray.400"
                      onClick={() => handleFollow(user.user_id + "")}
                    >
                      Follow
                    </Button>
                  )} */}
                  <Button
                    bgColor="transparent"
                    borderWidth={1}
                    borderColor="gray.400"
                    borderStyle="solid"
                    h={5}
                    display="block"
                    ml="auto"
                    mt={2}
                    rounded="full"
                    fontSize="xs"
                    fontWeight="normal"
                    color="gray.400"
                  >
                    <Link to={`/profile/${user.user_id}`}>View Profile</Link>
                  </Button>
                </Flex>
              ))}
        </Flex>
      </Box>

      <Box bgColor={colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} p={5} mt={5} rounded="lg">
        <Flex alignItems="center" gap={2}>
          <Text color="gray.300" fontSize="sm">
            Developed by{" "}
            <Text display="inline" fontWeight="semibold" as="span">
              Ridhwan
            </Text>
          </Text>
          &bull;
          <Box>
            <Icon as={RiGithubFill} />
            <Icon as={RiLinkedinBoxFill} />
            <Icon as={RiFacebookCircleFill} />
            <Icon as={RiInstagramFill} />
          </Box>
        </Flex>
        <Text color="gray.500" fontSize="xs">
          Powered By Dumbways Indonesia &bull; #1 CodingBootcamp
        </Text>
      </Box>
    </Box>
  );
}
