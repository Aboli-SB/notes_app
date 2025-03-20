"use client";

import { useState } from "react";
import { Input, Button, VStack, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";  // Import useRouter from Next.js
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();  // Initialize the router

  const handleLogin = async () => {
    try {
      const response = await api.post("/user/login", { email, password });

      toast({
        title: "Login successful!",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      
      // Store the token in localStorage or sessionStorage
      localStorage.setItem("token", response.data.accessToken);

      console.log("Login successful:", response.data);

      // Redirect to the profile page after successful login
      router.push("/profile");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      console.error("Login failed:", error.response?.data?.message || error);
    }
  };

  return (
    <VStack spacing={4} p={8}>
      <Heading>Login</Heading>
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
      <Button onClick={handleLogin} colorScheme="blue">
        Login
      </Button>
    </VStack>
  );
}


