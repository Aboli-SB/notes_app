"use client";

import { useContext, useState, useEffect } from "react";
import { Box, Button, Input, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { AuthContext } from "./context/AuthContext";
import api from "./utils/api";

export default function HomePage() {
  const { user, login, register, logout } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) fetchNotes();
  };

  const handleRegister = async () => {
    await register(username, email, password);
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/note/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  };

  const addNote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        "/note/create",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  return (
    <VStack spacing={4} p={8}>
      <Heading>Notes App</Heading>
      {user ? (
        <>
          <Text>Welcome, {user.email}!</Text>
          <Button onClick={logout} colorScheme="red" mt={2}>
            Logout
          </Button>

          <HStack spacing={2} mt={4}>
            <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Content" onChange={(e) => setContent(e.target.value)} />
            <Button onClick={addNote} colorScheme="blue">
              Add Note
            </Button>
          </HStack>

          {notes.map((note) => (
            <Box key={note._id} borderWidth="1px" p={4} mt={2}>
              <Heading size="md">{note.title}</Heading>
              <Text>{note.content}</Text>
            </Box>
          ))}
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
              <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <Input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <HStack spacing={2}>
                <Button onClick={handleRegister} colorScheme="teal">
                  Register
                </Button>
                <Button onClick={() => setIsRegistering(false)} colorScheme="blue" variant="link">
                  Already have an account? Login
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <Input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <HStack spacing={2}>
                <Button onClick={handleLogin} colorScheme="blue">
                  Login
                </Button>
                <Button onClick={() => setIsRegistering(true)} colorScheme="teal" variant="link">
                  New user? Register
                </Button>
              </HStack>
            </>
          )}
        </>
      )}
    </VStack>
  );
}