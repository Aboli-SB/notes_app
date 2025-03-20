const express = require("express");
const { createNote, getAllNote, updateNote, deleteNote, } = require("../controllers/noteController");
const authenticateUser = require("../middlewares/authUser");

const taskRouter = express.Router();

// Task Routes
taskRouter.post("/create", authenticateUser, createNote);
taskRouter.get("/all", authenticateUser, getAllNote);
taskRouter.patch("/update/:id", authenticateUser, updateNote);
taskRouter.delete("/delete/:id", authenticateUser, deleteNote);

module.exports = taskRouter;

