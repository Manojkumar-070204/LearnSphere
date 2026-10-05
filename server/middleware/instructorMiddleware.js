function instructorOnly(req, res, next) {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({
      message: "Instructor access required."
    })
  }

  next()
}

module.exports = instructorOnly