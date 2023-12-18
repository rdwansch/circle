import { Box, Flex, Icon, Image, Text, useColorMode } from "@chakra-ui/react";
import { LiaComment } from "react-icons/lia";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { ThreadType } from "../types/Thread";

export default function Thread({ data }: { data: ThreadType }) {
  const { colorMode } = useColorMode();

  return (
    <Box
      display="flex"
      gap={3}
      borderBottomColor="gray"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      pb={2}
    >
      <Image
        src="https://bit.ly/dan-abramov"
        boxSize={39}
        rounded="full"
        objectFit="cover"
        alt="Dan Abramov"
      />
      <Flex flexDirection="column">
        <Text fontSize="sm" fontWeight="semibold">
          {data.user.name}{" "}
          <Text color="GrayText" display="inline" fontWeight="normal">
            @{data.user.username} &bull; 4h
          </Text>
        </Text>

        <Text
          fontSize="sm"
          color={colorMode == "dark" ? "gray.300" : "gray.600"}
        >
          {data.content}
        </Text>

        <Flex gap={5} mt={5}>
          <Flex gap={2} alignItems="center" fontSize="sm">
            <Icon
              as={data.isLiked ? BsFillHeartFill : BsHeart}
              color={data.isLiked ? "red" : "white"}
            />
            <Text>{data.likes}</Text>
          </Flex>
          <Flex gap={2} alignItems="center" fontSize="sm">
            <Icon as={LiaComment} />
            <Text>{data.replies}Replies</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
