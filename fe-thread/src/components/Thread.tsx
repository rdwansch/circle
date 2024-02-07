import { Box, Flex, Icon, Image, Text, useColorMode } from "@chakra-ui/react";
import { LiaComment } from "react-icons/lia";
// import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { ThreadType } from "../types/Thread";
import { Link } from "react-router-dom";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { API } from "../libs/API";
import { useQueryClient } from "@tanstack/react-query";

export default function Thread({ data, detail, isReply }: { data: ThreadType; detail: boolean; isReply: boolean }) {
  // const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const auth = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const handleLikes = async () => {
    console.log("like please");
    try {
      const res = await API.post(`/v1/like/${data.id}`);
      console.log(res.data);
    } catch (err) {
      console.log("error on likes", err);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["like"] });
      queryClient.invalidateQueries({ queryKey: ["thread"] });
      queryClient.invalidateQueries({ queryKey: ["profile-thread"] });
    }
  };

  // console.log(data?.like?.filter(l => l?.user?.id == auth.id)[0] ? "isLiked" : "not liked");

  return (
    <Box display="flex" gap={3} borderBottomColor="gray.600" borderBottomWidth={1} borderBottomStyle="solid" pb={2}>
      <Image
        src={data?.user?.profile_picture || "/avatar_placeholder.png"}
        boxSize={39}
        rounded="full"
        objectFit="cover"
        alt="."
      />
      <Flex flexDirection="column">
        <Link
          to={isReply ? "" : `/threads/${data.id}`}
          style={{
            cursor: isReply ? "default" : "pointer",
          }}
        >
          <Text fontSize="sm" fontWeight="semibold">
            {data.user.full_name}{" "}
            <Text color="GrayText" display="inline" fontWeight="normal" as="span">
              @{data.user.username} &bull;
            </Text>
          </Text>
          <Text fontSize="sm" color={colorMode == "dark" ? "gray.300" : "gray.600"}>
            {data.content}
          </Text>
          {data.image && data.image !== "undefined" && <Image src={data.image} alt="Picture" boxSize="90%" />}
        </Link>

        <Flex alignItems="center" gap={2} mt={2}>
          <Text color="gray" fontSize="xs">
            {new Date(data.created_at).toLocaleTimeString()}
          </Text>{" "}
          &bull;{" "}
          <Text color="gray" fontSize="xs">
            {new Date(data.created_at).toLocaleDateString()}
          </Text>
        </Flex>

        <Flex gap={5} mt={2}>
          <Flex gap={2} alignItems="center" fontSize="sm" onClick={handleLikes} cursor={"pointer"}>
            <Icon
              as={data?.like?.filter(l => l?.user?.id == auth.id)[0] ? BsFillHeartFill : BsHeart}
              color={data?.like?.filter(l => l?.user?.id == auth.id)[0] ? "red" : "white"}
            />
            <Text>{data.like.length}</Text>
          </Flex>
          {!detail && (
            <Flex gap={2} alignItems="center" fontSize="sm">
              <Icon as={LiaComment} />
              <Text>{data.reply?.length || 0} Replies</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
