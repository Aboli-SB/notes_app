const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register a user (Only admins can create another admin)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Validate strong password
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Weak password" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure only admins can create another admin
        if (role === "admin") {
            if (!req.user || req.user.userRole !== "admin") {
                return res.status(403).json({ message: "Only admins can create another admin" });
            }
        }

        // Create user
        const newUser = await User.create({ username, email, password: hashedPassword, role });

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: newUser._id, userRole: newUser.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "User registered successfully", accessToken, newUser });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: "Error registering user" });
    }
};


// Log in
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token with admin status
        const accessToken = jwt.sign(
            { userId: user._id, userRole: user.role},
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", accessToken, isAdmin: user.isAdmin });
    } catch (error) {
        console.error("Error occurred during login:", error.message);
        res.status(500).json({ message: "Error logging in" });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", user });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: "Error getting user profile" });
    }
};

// Get All Users (Only Admins Can Access)
exports.getAllUsers = async (req, res) => {
    try {
        // Ensure req.user is populated and check role
        if (!req.user || req.user.userRole !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const users = await User.find();
        res.status(200).json({ message: "All users retrieved", users });
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ message: "Error getting all users" });
    }
};



// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// // Register a user
// exports.registerUser = async (req, res) => {
//     try {
//         const { username, email, password, role } = req.body;

//         if (!username || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ message: "Weak password" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, email, password: hashedPassword, role });

//         // Generate JWT token after registration
//         const accessToken = jwt.sign(
//             { userId: newUser._id, userRole: newUser.role },
//             process.env.SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         res.status(201).json({ message: "User registered successfully", accessToken, newUser });
//     } catch (error) {
//         console.error("Error occurred:", error.message);
//         res.status(500).json({ message: "Error registering user" });
//     }
// };

// // Log in
// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "Invalid email or password" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const accessToken = jwt.sign(
//             { userId: user._id, userRole: user.role },
//             process.env.SECRET_KEY,
//             { expiresIn: "1h" }
//         );

//         res.status(200).json({ message: "Login successful", accessToken });
//     } catch (error) {
//         console.error("Error occurred during login:", error.message);
//         res.status(500).json({ message: "Error logging in" });
//     }
// };

// // Get User Profile
// exports.getUserProfile = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ message: "User found", user });
//     } catch (error) {
//         console.error("Error occurred:", error.message);
//         res.status(500).json({ message: "Error getting user profile" });
//     }
// };

// // Get All Users
// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json({ message: "All users retrieved", users });
//     } catch (error) {
//         console.error("Error occurred:", error.message);
//         res.status(500).json({ message: "Error getting all users" });
//     }
// };


