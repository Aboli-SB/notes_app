"use client";

import { Box, Button, Text } from "@chakra-ui/react";

export default function NoteCard({ note, onDelete }) {
  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text>{note.content}</Text>
      <Button colorScheme="red" onClick={() => onDelete(note._id)}>Delete</Button>
    </Box>
  );
}
