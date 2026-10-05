const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const User = require("../models/User")

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required."
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters."
      })
    }

    const normalizedEmail =
      email.toLowerCase().trim()

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      })

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists."
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student"
    })

    res.status(201).json({
      message:
        "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error(
      "Registration error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to register user."
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required."
      })
    }

    const normalizedEmail =
      email.toLowerCase().trim()

    const user =
      await User.findOne({
        email: normalizedEmail
      })

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password."
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

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password."
      })
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      )

    res.status(200).json({
      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error(
      "Login error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to login."
    })
  }
}

const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message:
          "Email is required."
      })
    }

    const user =
      await User.findOne({
        email: email.toLowerCase().trim()
      })

    if (!user) {
      return res.status(404).json({
        message:
          "No account found with this email."
      })
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex")

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    user.resetPasswordToken =
      hashedToken

    user.resetPasswordExpires =
      Date.now() +
      15 * 60 * 1000

    await user.save()

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      })

    const resetUrl =
      `${
        process.env.FRONTEND_URL ||
        "http://localhost:5173"
      }/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject:
        "LearnSphere Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>LearnSphere Password Reset</h2>

          <p>
            You requested a password reset
            for your LearnSphere account.
          </p>

          <p>
            Click the button below to
            create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#6c63ff;
              color:white;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in
            15 minutes.
          </p>
        </div>
      `
    })

    res.status(200).json({
      message:
        "Password reset email sent successfully."
    })
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to send password reset email."
    })
  }
}

const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        message:
          "Token and new password are required."
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters."
      })
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: Date.now()
        }
      })

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token."
      })
    }

    user.password =
      await bcrypt.hash(
        password,
        10
      )

    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    res.status(200).json({
      message:
        "Password reset successful."
    })
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to reset password."
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
}