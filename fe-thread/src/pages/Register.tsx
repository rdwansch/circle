import { Alert, AlertIcon, Box, Button, Input, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../libs/API";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof user) => API.post("/v1/user/register", data),
    onSuccess() {
      navigate("/login", { replace: true });
    },
    onError(err) {
      console.log("Error mutate Register:", err.message);
    },
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(user => ({ ...user, [e.target.name]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(user);
  };

  return (
    <Box mx="auto" maxW="500px" mt={10}>
      <Alert
        status="error"
        mb={10}
        visibility={mutation.isError ? "visible" : "hidden"}
      >
        <AlertIcon />
        {mutation.error?.message}
      </Alert>
      <Text fontSize="4xl" color="#04a51e" fontWeight="bold">
        circle
      </Text>
      <Text fontSize="2xl" color="whitesmoke" fontWeight="bold">
        Create Account Circle
      </Text>
      <form onSubmit={handleSubmit}>
        <Box maxW="full" display="flex" flexDirection="column" gap="5" mt={5}>
          <Input
            variant="flushed"
            placeholder="Username"
            onChange={handleOnChange}
            name="username"
          />
          <Input
            variant="flushed"
            placeholder="Password"
            onChange={handleOnChange}
            name="password"
            type="password"
          />
          <Input
            variant="flushed"
            placeholder="Full name"
            onChange={handleOnChange}
            name="full_name"
          />
          <Input
            variant="flushed"
            placeholder="Email"
            onChange={handleOnChange}
            name="email"
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
        >
          Create Account
        </Button>

        <Text fontSize="sm">
          Already have account?{" "}
          <Text display="inline" color="#04a51e" as="span">
            <Link to="/login">Login</Link>{" "}
          </Text>
        </Text>
      </form>
    </Box>
  );
}
