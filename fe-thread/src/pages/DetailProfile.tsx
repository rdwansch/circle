import { Box, Flex, Image, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, Tab, Button } from "@chakra-ui/react";
import SideNav from "../components/SideNav";
import { useQuery } from "@tanstack/react-query";
import { API } from "../libs/API";
import { useParams } from "react-router-dom";
import { ThreadType } from "../types/Thread";
import { AxiosResponse } from "axios";
import Thread from "../components/Thread";
import { UserType } from "../types/User";
import { FollowerType, FollowingType } from "../types/Follows";

export default function DetailProfile() {
  const { id } = useParams();

  const queryProfile = useQuery<AxiosResponse<{ data: UserType }>>({
    queryFn: () => API.get(`/v1/user/getEditProfile/${id}`),
    queryKey: ["profile-user"],
  });

  const queryThreads = useQuery<AxiosResponse<{ data: ThreadType[] }>>({
    queryFn: () => API.get(`/v1/thread/user/${id}`),
    queryKey: ["profile-thread"],
  });

  const queryFollower = useQuery<FollowerType[]>({
    queryKey: ["follower"],
    queryFn: async () => {
      const resFollower = await API.get(`/v1/followers/${id}`);
      const resFollowing = await API.get(`/v1/following/${id}`);

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

  const handleUnfollow = async () => {
    await API.post(`/v1/unfollow/${id}`);
    queryFollower.refetch();
  };

  const handleFollow = async () => {
    await API.post("/v1/follows", { followingId: id });
    queryFollower.refetch();
  };

  return (
    <>
      <SideNav />

      <Box ml="300px" gap={5} width="600px">
        <Box w="700px" p={5}>
          <Box pos="relative" bgGradient="linear(to-r, green.200, pink.500)" rounded="lg" height={40}>
            <Image
              src={queryProfile.data?.data.data.profile_picture || "/avatar_placeholder.png"}
              rounded="full"
              objectFit="cover"
              alt="Dan Abramov"
              pos="absolute"
              bottom={-9}
              left={5}
              boxSize={100}
              borderWidth={2}
              borderColor="gray.700"
              borderStyle="solid"
              _hover={{
                opacity: 0.9,
              }}
              cursor="pointer"
            />
          </Box>
          <Flex justifyContent="flex-start">
            <Flex p={5} flexDirection="column" mt={7}>
              <Text>{queryProfile.data?.data.data.full_name}</Text>
              <Text>@{queryProfile.data?.data.data.username}</Text>
              <Text>{queryProfile.data?.data.data.profile_description}</Text>
            </Flex>
            {!queryFollower.isPending &&
              queryFollower.data?.length !== 0 &&
              queryFollower.data?.map(f => (
                <Button
                  key={f.id}
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
                  onClick={handleUnfollow}
                >
                  Unfollow
                </Button>
              ))}

            {!queryFollower.isPending && queryFollower.data?.length == 0 && (
              <Button
                key={"ss"}
                bgColor="transparent"
                borderWidth={1}
                mt={2}
                borderColor="gray.200"
                borderStyle="solid"
                h={5}
                display="block"
                ml="auto"
                rounded="full"
                fontSize="xs"
                fontWeight="normal"
                color="gray.200"
                onClick={handleFollow}
              >
                Follow
              </Button>
            )}
          </Flex>
          <Tabs variant="unstyled" colorScheme="">
            <TabList
              justifyContent="center"
              gap={10}
              borderBottomColor="gray"
              borderBottomWidth={1}
              borderBottomStyle="solid"
            >
              <Tab w="full">Threads</Tab>
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="green.500" borderRadius="1px" />

            <TabPanels>
              <TabPanel>
                <Flex flexDirection="column" alignItems="center" gap={4}></Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {!queryThreads.isPending && queryThreads.data?.data.data.length == 0 && "No post"}
          <Flex flexDirection="column" gap={10}>
            {!queryThreads.isPending &&
              queryThreads.data?.data.data.map(thread => (
                <Thread detail={false} isReply={false} data={{ ...thread }} key={thread.id} />
              ))}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
