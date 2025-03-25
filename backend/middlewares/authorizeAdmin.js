
const authorizeAdmin = (req, res, next) => {
    if (!req.body.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = authorizeAdmin;



// const User = require("../models/user");

// const authorizeAdmin = async (req, res, next) => {
//     try {
//         const userId = req.body.userId;

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (!user.isAdmin) {
//             return res.status(403).json({ message: "Access Denied: Admins only" });
//         }
//         next();
//     } catch (error) {
//         console.error("Authorization Error:", error.message);
//         res.status(500).json({ message: "Authorization failed" });
//     }
// };

// module.exports = authorizeAdmin;
