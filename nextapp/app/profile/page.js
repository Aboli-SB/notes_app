'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, VStack, Heading, Text, Input, useToast, HStack, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const toast = useToast();
  const router = useRouter();

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: 'No token found, please log in', status: 'warning' });
        router.push('/'); // Redirect to login page
        return;
      }

      const response = await axios.get("http://localhost:8000/note/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error.response?.data?.message || error.message);
      toast({ title: 'Error fetching notes', status: 'error' });
    }
  };

  // Save Note (Create/Update)
  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!title || !content) {
        toast({ title: 'Title and content are required', status: 'warning' });
        return;
      }

      if (editingNoteId) {
        await axios.patch(`http://localhost:8000/note/update/${editingNoteId}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: 'Note updated!', status: 'success' });
      } else {
        await axios.post("http://localhost:8000/note/create", { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({ title: 'Note created!', status: 'success' });
      }

      setTitle('');
      setContent('');
      setEditingNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error.response?.data?.message || error.message);
      toast({ title: 'Error saving note', status: 'error' });
    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Note deleted!', status: 'success' });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error.response?.data?.message || error.message);
      toast({ title: 'Error deleting note', status: 'error' });
    }
  };

  // Edit Note
  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note._id);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingNoteId(null);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({ title: 'Logged out successfully', status: 'success' });
    setUser(null);
    router.push('/'); // Redirect to home or login page
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <VStack spacing={4} p={8}>
      <Heading>Profile</Heading>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
      <Box>
        <Input 
          placeholder='Title' 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          mb={2}
        />
        <Input 
          placeholder='Content' 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          mb={2}
        />
        <HStack>
          <Button onClick={handleSaveNote} colorScheme='blue'>
            {editingNoteId ? 'Update' : 'Add'} Note
          </Button>
          {editingNoteId && (
            <Button onClick={handleCancelEdit} colorScheme='gray'>
              Cancel
            </Button>
          )}
        </HStack>
      </Box>
      {notes.map((note) => (
        <HStack key={note._id} w='full' justifyContent='space-between' p={2} borderWidth='1px' rounded='md'>
          <Text>{note.title} - {note.content}</Text>
          <HStack>
            <Button size='sm' colorScheme='yellow' onClick={() => handleEditNote(note)}>
              Edit
            </Button>
            <Button size='sm' colorScheme='red' onClick={() => handleDeleteNote(note._id)}>
              Delete
            </Button>
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
}