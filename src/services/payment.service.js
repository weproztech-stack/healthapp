const crypto = require("crypto");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

// ─────────────────────────────────────────
// Razorpay Safe Instance
// ─────────────────────────────────────────
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require("razorpay");
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn("Razorpay not configured yet - payments disabled");
}

// ─────────────────────────────────────────
// 1. ORDER CREATE
// ─────────────────────────────────────────
exports.createPayment = async (identifier, data) => {
  if (!razorpay) throw new Error("Payment service not configured");

  const { amount, currency = "INR", bookingType, bookingId, notes } = data;

  if (!amount || !bookingType || !bookingId) {
    throw new Error("amount, bookingType aur bookingId required hain");
  }

  const user = await User.findOne({ phone: identifier });
  if (!user) throw new Error("User not found");

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `receipt_${bookingId}`,
    notes: notes || {},
  });

  const payment = await Payment.create({
    userId: user._id,
    bookingId,
    bookingType,
    amount,
    currency,
    razorpayOrderId: order.id,
    status: "pending",
  });

  return {
    payment,
    razorpayOrder: order,
    key: process.env.RAZORPAY_KEY_ID,
  };
};

// ─────────────────────────────────────────
// 2. PAYMENT VERIFY
// ─────────────────────────────────────────
exports.verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!process.env.RAZORPAY_KEY_SECRET) throw new Error("Payment service not configured");

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("razorpayOrderId, razorpayPaymentId, razorpaySignature required");
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Invalid payment signature");
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: "completed",
      paidAt: new Date(),
    },
    { new: true }
  );

  if (!payment) throw new Error("Payment record not found");

  return { success: true, payment };
};

// ─────────────────────────────────────────
// 3. REFUND PROCESS
// ─────────────────────────────────────────
exports.processRefund = async (paymentId, amount) => {
  if (!razorpay) throw new Error("Payment service not configured");

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Payment not found");
  if (payment.status !== "completed") throw new Error("Only completed payments can be refunded");
  if (payment.refundStatus === "refunded") throw new Error("Payment already refunded");

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: amount ? Math.round(amount * 100) : undefined,
  });

  payment.refundStatus = "refunded";
  payment.refundId = refund.id;
  payment.refundAmount = refund.amount / 100;
  payment.refundAt = new Date();
  await payment.save();

  return { success: true, refund, payment };
};

// ─────────────────────────────────────────
// 4. PAYMENT HISTORY
// ─────────────────────────────────────────
exports.getUserPayments = async (identifier) => {
  const user = await User.findOne({ phone: identifier });
  if (!user) throw new Error("User not found");

  const payments = await Payment.find({ userId: user._id })
    .sort({ createdAt: -1 });

  return payments;
};

// ─────────────────────────────────────────
// 5. REFUND HISTORY
// ─────────────────────────────────────────
exports.getUserRefunds = async (identifier) => {
  const user = await User.findOne({ phone: identifier });
  if (!user) throw new Error("User not found");

  const refunds = await Payment.find({
    userId: user._id,
    refundStatus: "refunded",
  }).sort({ refundAt: -1 });

  return refunds;
};