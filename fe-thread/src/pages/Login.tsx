import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API, setAuthorization } from "../libs/API";
import Cookie from "../utils/cookie";
import { useDispatch } from "react-redux";
import { setSession } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof user) => API.post("/v1/user/login", data),
    onSuccess(response) {
      const token = response.data.data.token;
      const payload = jwtDecode(token);

      dispatch(setSession(payload));

      setAuthorization(token);
      Cookie.set("token", token);
      navigate("/threads", { replace: true });
    },
    onError(err: Error) {
      console.log("Error mutate Login:", err.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(user);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(user => ({ ...user, [e.target.name]: e.target.value }));

  return (
    <>
      <Box mx="auto" maxW="500px" mt={10}>
        <Alert
          status="error"
          mb={10}
          visibility={mutation.isError ? "visible" : "hidden"}
        >
          <AlertIcon />
          {mutation?.error?.message.split(" ").at(-1) == "401"
            ? "username or password doesn't match"
            : mutation.error?.message}
        </Alert>
        <Text fontSize="4xl" color="#04a51e" fontWeight="bold">
          circle
        </Text>
        <Text fontSize="2xl" color="whitesmoke" fontWeight="bold">
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <Box maxW="full" display="flex" flexDirection="column" gap="5" mt={5}>
            <Input
              variant="flushed"
              placeholder="username"
              onChange={handleOnChange}
              name="username"
            />
            <Input
              variant="flushed"
              placeholder="password"
              onChange={handleOnChange}
              name="password"
              type="password"
            />
          </Box>
          <Button
            bgColor="#04a51e"
            rounded="full"
            color="white"
            fontWeight="semibold"
            marginTop={5}
            display="block"
            ml="auto"
            _hover={{ bg: "#019119" }}
            type="submit"
            isDisabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner size="xs" />} Login
          </Button>
          <Text fontSize="sm">
            Don't have an account yet?{" "}
            <Text display="inline" color="#04a51e" as="span">
              <Link to="/register">Create an account</Link>{" "}
            </Text>
          </Text>
        </form>
      </Box>
    </>
  );
}
