const express = require("express");
const { getUserProfile, getAllUsers, getUserById, registerUser, loginUser, } = require("../controllers/userController");
const authenticateUser = require("../middlewares/authUser");
//const authorizeA =require("../middlewares/authorizeAdmin");
const authorizeR=require("../middlewares/authorizeRole");
const userRouter = express.Router();

// User Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authenticateUser, getUserProfile);
userRouter.get("/all", authenticateUser, authorizeR(["admin"]), getAllUsers);

module.exports = userRouter;
