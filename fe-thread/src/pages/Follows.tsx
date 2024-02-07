import {
  Box,
  Button,
  Flex,
  Image,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SideNav from "../components/SideNav";
import SideProfile from "../components/SideProfile";
import { useQuery } from "@tanstack/react-query";
import { API } from "../libs/API";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { AxiosResponse } from "axios";
import { FollowerType, FollowingType } from "../types/Follows";

export default function Follows() {
  const auth = useSelector((state: RootState) => state.auth);

  const queryFollowing = useQuery<AxiosResponse<{ data: FollowingType[] }>>({
    queryKey: ["following"],
    queryFn: () => API.get(`/v1/following/${auth.id}`),
    enabled: true,
  });

  const queryFollower = useQuery<FollowerType[]>({
    queryKey: ["follower"],
    queryFn: async () => {
      const resFollower = await API.get(`/v1/followers/${auth.id}`);
      const resFollowing = await API.get(`/v1/following/${auth.id}`);

      const result = resFollower.data.data.map((currentUser: FollowerType) => {
        resFollowing.data.data.forEach((f: FollowingType) => {
          if (f.following.id == currentUser.follower.id) {
            currentUser.isFollowing = true;
            currentUser.followingId = f.following.id;
          } else {
            currentUser.isFollowing = false;
          }
        });

        return currentUser;
      });

      return result;
    },
    enabled: true,
  });

  const handleUnfollow = async (id: string) => {
    await API.post(`/v1/unfollow/${id}`);
    queryFollowing.refetch();
    queryFollower.refetch();
  };

  const handleFollow = async (followingId: string) => {
    await API.post("/v1/follows", { followingId });
    queryFollowing.refetch();
    queryFollower.refetch();
  };

  return (
    <>
      <SideNav />
      <Box ml="300px" display="flex" gap={5}>
        <Box w="700px" p={5} borderRightWidth={1} borderRightStyle="solid">
          <Tabs variant="unstyled" colorScheme="">
            <TabList
              justifyContent="center"
              gap={10}
              borderBottomColor="gray"
              borderBottomWidth={1}
              borderBottomStyle="solid"
            >
              <Tab w="full">Followers</Tab>
              <Tab w="full">Following</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="green.500"
              borderRadius="1px"
            />

            <TabPanels>
              <TabPanel>
                <Flex flexDirection="column" alignItems="center" gap={4}>
                  {!queryFollower.isPending &&
                    queryFollower.data &&
                    queryFollower.data.map(f => (
                      <Flex
                        key={f.follower.username}
                        gap={3}
                        w={400}
                        py={3}
                        _notLast={{
                          borderBottomColor: "gray.700",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                        }}
                      >
                        <Image
                          src={
                            f.follower.profile_picture ||
                            "/avatar_placeholder.png"
                          }
                          objectFit="cover"
                          alt={auth.username}
                          boxSize={10}
                          rounded="full"
                        />
                        <Flex flexDirection="column" fontSize="sm">
                          <Text>{f.follower.full_name}</Text>
                          <Text color="gray.500">@{f.follower.username}</Text>
                        </Flex>

                        {/* eslint-disable-next-line no-constant-condition */}
                        {f.isFollowing ? (
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
                            onClick={() => handleUnfollow(f.followingId + "")}
                          >
                            Unfollow
                          </Button>
                        ) : (
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
                            onClick={() => handleFollow(f.follower.id + "")}
                          >
                            Follow
                          </Button>
                        )}
                      </Flex>
                    ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex flexDirection="column" alignItems="center" gap={4}>
                  {!queryFollowing.isPending &&
                    queryFollowing.data?.data.data.map(f => (
                      <Flex
                        key={f.id}
                        gap={3}
                        w={400}
                        py={3}
                        _notLast={{
                          borderBottomColor: "gray.700",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                        }}
                      >
                        <Image
                          src={
                            f.following.profile_picture ||
                            "/avatar_placeholder.png"
                          }
                          objectFit="cover"
                          alt="Dan Abramov"
                          boxSize={10}
                          rounded="full"
                        />
                        <Flex flexDirection="column" fontSize="sm">
                          <Text>{f.following.full_name}</Text>
                          <Text color="gray.500">@{f.following.username}</Text>
                        </Flex>

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
                          onClick={() => handleUnfollow(f.following.id + "")}
                        >
                          Unfollow
                        </Button>
                      </Flex>
                    ))}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <SideProfile />
      </Box>
    </>
  );
}
