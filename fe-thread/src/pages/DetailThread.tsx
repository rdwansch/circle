import { Box, Button, Flex, Icon, Image, Text, Textarea } from "@chakra-ui/react";
import SideNav from "../components/SideNav";
import Thread from "../components/Thread";
import SideProfile from "../components/SideProfile";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useId, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../libs/API";
import { AxiosResponse } from "axios";
import { ThreadType } from "../types/Thread";
import { ReplyType } from "../types/Reply";
import { LikeType } from "../types/Like";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function DetailThread() {
  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState<File>();
  const params = useParams();
  const id = useId();

  const queryClient = useQueryClient();
  const auth = useSelector((state: RootState) => state.auth);

  const queryThread = useQuery<AxiosResponse<{ data: ThreadType }>>({
    queryKey: ["detailThread"],
    queryFn: () => API.get(`/v1/thread/${params.id}`),
  });

  const queryLike = useQuery<AxiosResponse<{ data: LikeType[] }>>({
    queryKey: ["like"],
    queryFn: () => API.get(`/v1/like/${params.id}`),
  });

  const queryReply = useQuery<AxiosResponse<{ data: ReplyType[] }>>({
    queryKey: ["reply"],
    queryFn: () => API.get(`/v1/reply/${params.id}`),
  });

  const mutationReply = useMutation({
    mutationFn: (data: FormData) => API.post(`/v1/reply/${params.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reply"] });
      setImage(undefined);
      setContent("");
      setPreviewImage("");
    },
    onError: err => {
      console.log("Error on mutationPostReply:", err.message);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("content", content);
    formData.set("image", image as File);

    mutationReply.mutate(formData);
  };

  const handleOnChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const objUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(objUrl);
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      <SideNav />

      <Box ml="300px" display="flex" gap={5}>
        <Box w="700px" p={5} borderRightWidth={1} borderRightStyle="solid">
          <Link to="/threads">
            <Flex alignItems="center" gap={1}>
              <Icon as={BsArrowLeft} />
              <Text fontSize="2xl">Status</Text>
            </Flex>
          </Link>

          <Flex mt={5} flexDirection="column" gap={10}>
            {!queryThread.isPending && (
              <Thread
                key={"-}{.d" + id}
                detail={false}
                isReply={false}
                data={{
                  created_at: queryThread.data?.data.data.created_at + "",
                  id: Number(queryThread.data?.data.data.id),
                  content: queryThread.data?.data.data.content,
                  image: queryThread.data?.data.data.image,
                  isLiked: false,
                  like: queryLike.data?.data.data || [],
                  reply: queryThread.data?.data.data.reply || [],
                  user: {
                    full_name: queryThread.data?.data.data.user.full_name + "",
                    id: Number(queryThread.data?.data.data.user.id),
                    profile_picture: queryThread.data?.data.data.user.profile_picture + "",
                    username: queryThread.data?.data.data.user.username + "",
                    created_at: queryThread.data?.data.data.user.created_at + "",
                    profile_description: queryThread.data?.data.data.user.profile_description + "",
                  },
                }}
              />
            )}
          </Flex>

          <form onSubmit={handleSubmit}>
            <Flex gap={3} mt={10}>
              <Image
                src={auth.profile_picture || "/avatar_placeholder.png"}
                boxSize={39}
                rounded="full"
                objectFit="cover"
                alt={auth.username}
              />
              <Box borderBottomWidth={1} borderBottomColor="GrayText" mt={1} w="100%">
                <Textarea
                  outline="none"
                  placeholder="Type your reply!"
                  value={content}
                  border="none"
                  rows={1}
                  onChange={e => setContent(e.target.value + "")}
                ></Textarea>
                {previewImage && <Image src={previewImage} alt="" boxSize={200} mt={10} />}
              </Box>

              <Flex alignItems="flex-end" gap={3}>
                <label htmlFor="input-file">
                  <Icon as={LuImagePlus} color={"green"} />
                </label>
                <input type="file" onChange={handleOnChangeImage} id="input-file" hidden />
                <Button
                  bgColor="#04a51e"
                  color="white"
                  fontWeight="semibold"
                  _hover={{ bg: "#019119" }}
                  w={20}
                  h={7}
                  rounded="xl"
                  type="submit"
                >
                  Reply
                </Button>
              </Flex>
            </Flex>
          </form>

          <Flex flexDirection="column" gap={2} mt={5}>
            {!queryReply.isPending &&
              queryReply.data?.data.data.map(reply => (
                <Thread
                  detail={true}
                  isReply={true}
                  key={reply.id + reply.created_at}
                  data={{
                    created_at: reply.created_at + "",
                    id: Number(reply.id),
                    content: reply.content,
                    image: reply.image,
                    isLiked: false,
                    like: [],
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    replies: [],
                    user: {
                      full_name: reply.user.full_name + "",
                      id: Number(reply.user.id),
                      profile_picture: reply.user.profile_picture + "",
                      username: reply.user.username + "",
                      created_at: reply.user.created_at + "",
                      profile_description: reply.user.profile_description + "",
                    },
                  }}
                />
              ))}
          </Flex>
        </Box>

        <SideProfile />
      </Box>
    </>
  );
}
