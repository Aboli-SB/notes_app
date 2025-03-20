const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token not found. Please log in." });

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid token. Please log in again." });

            req.body.userId = decoded.userId;
            req.body.userRole = decoded.userRole;
            next();
        });
    } catch (error) {
        console.error("JWT Authentication Error: ", error.message);
        res.status(500).json({ message: "Authentication failed. Please try again." });
    }
};

module.exports = authenticateUser;
