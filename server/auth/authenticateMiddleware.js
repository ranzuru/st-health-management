const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const generateNewAccessToken = (userId, refreshTokenSecret) => {
  return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "1h" });
};

const authenticateMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    req.user = user.toObject();
    // RETRIEVE USER DATA FOR LOGGING
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.headers["x-refresh-token"];
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const newAccessToken = generateNewAccessToken(
          decodedRefreshToken.userId,
          process.env.JWT_SECRET
        );

        res.setHeader("x-new-access-token", newAccessToken);
        req.user = (await User.findById(decodedRefreshToken.userId)).toObject();
        // RETRIEVE USER DATA FOR LOGGING
        req.userData = { userId: decodedRefreshToken.userId };
        // Potentially issue a new refresh token here

        next();
      } catch (refreshTokenError) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = authenticateMiddleware;