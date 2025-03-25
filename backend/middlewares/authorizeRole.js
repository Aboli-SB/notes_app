const authorizeRole = (roles) => {
    return (req, res, next) => {
        console.log("Decoded User Data:", req.user); // Debug log
        
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. No user found in request." });
        }

        console.log("User Role:", req.user.userRole); // Debug log

        if (!roles.includes(req.user.userRole)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }

        next();
    };
};

module.exports = authorizeRole;
