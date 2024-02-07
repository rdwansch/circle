import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuImagePlus } from "react-icons/lu";
import { Box, Flex, Icon, Text, Image, Button, Textarea } from "@chakra-ui/react";

import { API } from "../libs/API";
import { ThreadType } from "../types/Thread";
import SideNav from "../components/SideNav";
import Thread from "../components/Thread";
import { AxiosResponse } from "axios";
import SideProfile from "../components/SideProfile";
// import { LikeType } from "../types/Like";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { LikeType } from "../types/Like";

export default function Home() {
  const [previewImage, setPreviewImage] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File>();

  const queryClient = useQueryClient();
  const auth = useSelector((state: RootState) => state.auth);

  // const queryLike = useQuery<AxiosResponse<{ data: LikeType[] }>>({
  //   queryKey: ["like"],
  //   queryFn: () => API.get(`/v1/like/`),
  // });

  const query = useQuery<AxiosResponse<{ data: ThreadType[] }>>({
    queryKey: ["thread"],
    enabled: true,
    queryFn: () => API.get("/v1/thread"),
  });

  const mutationPostThread = useMutation({
    mutationFn: (data: FormData) => API.post("/v1/thread", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread"] });
      setImage(undefined);
      setContent("");
      setPreviewImage("");
    },
    onError: err => {
      console.log(mutationPostThread.data?.data);
      console.log("Error on mutationPostThread:", err.message);
    },
  });

  const handleOnChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const objUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(objUrl);
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image as File);

    mutationPostThread.mutate(formData);
  };

  // useEffect(() => {
  // formatData();
  // }, []);

  return (
    <>
      <SideNav />
      <Box ml="300px" display="flex" gap={5}>
        <Box w="700px" p={5} borderRightWidth={1} borderRightStyle="solid">
          <Text fontSize="2xl">Home</Text>

          <form onSubmit={handleSubmit}>
            <Flex gap={3} mt={10}>
              <Image
                src={auth.profile_picture || "/avatar_placeholder.png"}
                boxSize={39}
                rounded="full"
                objectFit="cover"
                alt="Dan Abramov"
              />
              <Box borderBottomWidth={1} borderBottomColor="GrayText" mt={1} w="100%">
                <Textarea
                  outline="none"
                  placeholder="What is happening?!"
                  value={content}
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
                  Post
                </Button>
              </Flex>
            </Flex>
          </form>

          <Flex mt={10} flexDirection="column" gap={10}>
            {!query.isPending &&
              query.data?.data.data.map(thread => (
                <Thread detail={false} isReply={false} data={{ ...thread }} key={thread.id} />
              ))}
          </Flex>
        </Box>
        <SideProfile />
      </Box>
    </>
  );
}
