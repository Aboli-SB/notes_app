"use client";

import { useState } from "react";
import { Input, Button, VStack, Heading, useToast } from "@chakra-ui/react";
import api from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleRegister = async () => {
    try {
      const response = await api.post("/users/register", {
        username,
        email,
        password,
      });

      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log("Registration successful:", response.data);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      console.error("Registration failed:", error.response?.data?.message || error);
    }
  };

  return (
    <VStack spacing={4} p={8}>
      <Heading>Register</Heading>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleRegister} colorScheme="teal">
        Register
      </Button>
    </VStack>
  );
}

