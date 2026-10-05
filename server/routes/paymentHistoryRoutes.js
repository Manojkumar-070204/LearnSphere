const express = require("express")

const {
  getPaymentHistory
} = require("../controllers/paymentHistoryController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.get(
  "/",
  authMiddleware,
  getPaymentHistory
)

module.exports = router