const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach user data to req.user
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateUser;




// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const authenticateUser = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) return res.status(401).json({ message: "Token not found. Please log in." });

//         jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//             if (err) return res.status(401).json({ message: "Invalid token. Please log in again." });

//             req.body.userId = decoded.userId;
           
//             req.user = decoded;
//             next();
//         });
//     } catch (error) {
//         console.error("JWT Authentication Error: ", error.message);
//         res.status(500).json({ message: "Authentication failed. Please try again." });
//     }
// };

// module.exports = authenticateUser;
