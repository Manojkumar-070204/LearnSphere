const jwt = require("jsonwebtoken")

const User = require("../models/User")

async function protect(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        message:
          "Authentication required."
      })
    }

    const token =
      authHeader.split(" ")[1]

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )

    const user =
      await User.findById(
        decoded.id
      ).select(
        "_id name email role disabled"
      )

    if (!user) {
      return res.status(401).json({
        message:
          "User account not found."
      })
    }

    if (
      user.disabled &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Your account has been disabled. Please contact the administrator."
      })
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message:
        "Invalid or expired token."
    })
  }
}

module.exports = protect