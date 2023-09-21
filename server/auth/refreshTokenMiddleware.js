const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    req.newToken = jwt.sign(
      { userId: decodedToken.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    next();
  } catch (error) {
    console.error("Refresh Token failed:", error);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
