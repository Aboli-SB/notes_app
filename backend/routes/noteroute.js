const express = require("express");
const { createNote, getAllNote, updateNote, deleteNote, } = require("../controllers/noteController");
const authenticateUser = require("../middlewares/authUser");
const authorizeR=require("../middlewares/authorizeRole");

const taskRouter = express.Router();

// Task Routes
taskRouter.post("/create", authenticateUser,authorizeR(["user","admin"]), createNote);
taskRouter.get("/all", authenticateUser,authorizeR(["user","admin"]), getAllNote);
taskRouter.patch("/update/:id", authenticateUser, authorizeR(["admin"]),updateNote);
taskRouter.delete("/delete/:id", authenticateUser,authorizeR(["admin"]),deleteNote);

module.exports = taskRouter;

