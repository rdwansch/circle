import { Box, Button, Flex, Image, Input, Spinner } from "@chakra-ui/react";
import SideNav from "../components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { API } from "../libs/API";
import { RootState } from "../store";
import { removeSession, setSession } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [profilePicture, setProfilePicture] = useState<File>();

  const getProfile = async () => {
    const res = await API.get(`/v1/user/getEditProfile/${auth.id}`);
    setFullName(res.data.data.full_name + "");
    setUsername(res.data.data.username + "");
    setPassword("");
    setProfileDescription(res.data.data.profile_description);
    setEmail(res.data.data.email + "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("full_name", fullName);
    formData.set("username", username);
    formData.set("password", password);
    formData.set("email", email);
    formData.set("profile_description", profileDescription);
    formData.set("image", profilePicture as File);

    setIsLoading(true);
    const res = await API.patch(`/v1/user/editProfile/${auth.id}`, formData);
    const decoded = jwtDecode(res.data.data);

    dispatch(setSession(decoded));
    setIsLoading(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(url);
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleDelete = async () => {
    const c = confirm("Delete account?");
    if (c) {
      await API.delete(`/user/delete/${auth.id}`);
      dispatch(removeSession());
      navigate("/login");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <SideNav />
      {isLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.4)"
          zIndex={9}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Box ml="300px" gap={5} width="600px">
          <Box w="700px" p={5}>
            <Box
              pos="relative"
              bgGradient="linear(to-r, green.200, pink.500)"
              rounded="lg"
              height={40}
            >
              <label htmlFor="input-image">
                <Image
                  src={
                    previewImage ||
                    auth.profile_picture ||
                    "/avatar_placeholder.png"
                  }
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
              </label>
              <input
                type="file"
                hidden
                id="input-image"
                onChange={handleImageChange}
              />
            </Box>
          </Box>
          <Flex p={5} flexDirection="column">
            <Input
              variant="flushed"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <Input
              variant="flushed"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input
              variant="flushed"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              variant="flushed"
              placeholder="Profile description"
              value={profileDescription}
              onChange={e => setProfileDescription(e.target.value)}
            />
            <Input
              variant="flushed"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Flex justifyContent="flex-end" mt={5}>
              <Button size="sm" color="green.500" variant="ghost" type="submit">
                Save
              </Button>
              <Button
                size="sm"
                color="red.500"
                variant="ghost"
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </Flex>
          </Flex>
        </Box>
      </form>
    </>
  );
}
