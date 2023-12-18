import {
  Box,
  Flex,
  Icon,
  Text,
  Image,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import {
  RiFacebookCircleFill,
  RiGithubFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
} from "react-icons/ri";
import { LuImagePlus } from "react-icons/lu";

import SideNav from "../components/SideNav";
import Thread from "../components/Thread";
import data from "../mocks/Thread.json";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ThreadType } from "../types/Thread";

export default function Home() {
  const { colorMode } = useColorMode();
  const [threadData, setThreadData] = useState<ThreadType[]>([]);
  const inputImage = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleOnChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const objUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(objUrl);
    }
  };

  useEffect(() => {
    setThreadData(data);
  }, []);

  return (
    <>
      <SideNav />
      <Box ml="300px" display="flex" gap={5}>
        <Box w="700px" p={5} borderRightWidth={1} borderRightStyle="solid">
          <Text fontSize="2xl">Home</Text>

          <Flex gap={3} mt={10}>
            <Image
              src="https://bit.ly/dan-abramov"
              boxSize={39}
              rounded="full"
              objectFit="cover"
              alt="Dan Abramov"
            />
            <Box
              borderBottomWidth={1}
              borderBottomColor="GrayText"
              mt={1}
              w="100%"
            >
              <Box
                contentEditable
                outline="none"
                _empty={{
                  _before: {
                    content: '"What is happening?!"',
                    color: "gray",
                  },
                }}
              ></Box>
              {previewImage && (
                <Image src={previewImage} alt="" boxSize={200} mt={10} />
              )}
            </Box>

            <Flex alignItems="flex-end" gap={3}>
              <label htmlFor="input-file">
                <Icon as={LuImagePlus} color={"green"} />
              </label>
              <input
                type="file"
                ref={inputImage}
                onChange={handleOnChangeImage}
                id="input-file"
                hidden
              />
              <Button
                bgColor="#04a51e"
                color="white"
                fontWeight="semibold"
                _hover={{ bg: "#019119" }}
                w={20}
                h={7}
                rounded="xl"
              >
                Post
              </Button>
            </Flex>
          </Flex>

          <Flex mt={10} flexDirection="column" gap={10}>
            {threadData &&
              threadData.map(thread => (
                <Thread data={thread} key={thread.id} />
              ))}
          </Flex>
        </Box>
        <Box top={0} right={0} w="400px" p={5}>
          <Box
            bgColor={
              colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
            }
            p={5}
            rounded="lg"
          >
            <Text fontWeight="semibold" my={2}>
              My Profile
            </Text>
            <Box
              pos="relative"
              bgGradient="linear(to-r, green.200, pink.500)"
              rounded="lg"
              height={40}
            >
              <Image
                src="https://bit.ly/dan-abramov"
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
              Edit Profile
            </Button>
            <Text>Indah Pra Karya</Text>
            <Text fontSize="sm" color="gray.500">
              @indahpra
            </Text>
            <Text color="gray.300" fontWeight="normal">
              Picked over by the worms, and weird fishes
            </Text>
            <Flex gap={5} mt={2}>
              <Flex>
                <Text>291</Text>
                <Text color="gray.500">Following</Text>
              </Flex>
              <Flex>
                <Text>23</Text>
                <Text color="gray.500">Followers</Text>
              </Flex>
            </Flex>
          </Box>

          <Box
            bgColor={
              colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
            }
            p={5}
            mt={5}
            rounded="lg"
          >
            <Text fontWeight="semibold">Sugested for you</Text>
            <Flex flexDirection="column" gap={2} mt={5}>
              <Flex gap={3}>
                <Image
                  src="https://bit.ly/dan-abramov"
                  objectFit="cover"
                  alt="Dan Abramov"
                  boxSize={10}
                  rounded="full"
                />
                <Flex flexDirection="column" fontSize="sm">
                  <Text>Mohammed Jawahir</Text>
                  <Text color="gray.500">@em.jawahir</Text>
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
                >
                  Following
                </Button>
              </Flex>
              <Flex gap={3}>
                <Image
                  src="https://bit.ly/dan-abramov"
                  objectFit="cover"
                  alt="Dan Abramov"
                  boxSize={10}
                  rounded="full"
                />
                <Flex flexDirection="column" fontSize="sm">
                  <Text>Mohammed Jawahir</Text>
                  <Text color="gray.500">@em.jawahir</Text>
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
                  Follow
                </Button>
              </Flex>
            </Flex>
          </Box>

          <Box
            bgColor={
              colorMode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
            }
            p={5}
            mt={5}
            rounded="lg"
          >
            <Flex alignItems="center" gap={2}>
              <Text color="gray.300" fontSize="sm">
                Developed by{" "}
                <Text display="inline" fontWeight="semibold">
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
              Powered ByDumbways Indonesia &bull; #1 CodingBootcamp
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
}
