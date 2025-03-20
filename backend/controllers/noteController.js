// Updated Backend - noteController.js
const Note = require('../models/note.js');
const mongoose=require("mongoose")

// Create Note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.body.userId;
        const note = new Note({ title, content, userId:new mongoose.Types.ObjectId( userId) });
        await note.save();

        res.status(201).json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error creating the note' });
    }
};

// Read Notes
exports.getAllNote = async (req, res) => {
    try {
        const userId = req.body.userId;
        const notes = await Note.find({ userId: userId });
        res.status(200).json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

// Update Note
exports.updateNote = async (req, res) => {
    const noteId = req.params.id;
    const updateData = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to update the note' });
    }
};

// Delete Note
exports.deleteNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to delete the note' });
    }
};