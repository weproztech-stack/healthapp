const paymentService = require("../services/payment.service");

/*
CREATE PAYMENT - Razorpay Order banao
*/
const createPayment = async (req, res) => {
  try {
    const identifier = req.user.identifier;
    const payment = await paymentService.createPayment(identifier, req.body);

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
VERIFY PAYMENT - Frontend se signature verify karo
*/
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const result = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: result.payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
PROCESS REFUND
*/
const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount } = req.body; // Optional - nahi diya toh full refund

    const result = await paymentService.processRefund(paymentId, amount);

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refund: result.refund,
      payment: result.payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
GET MY PAYMENTS
*/
const getMyPayments = async (req, res) => {
  try {
    const identifier = req.user.identifier;
    const payments = await paymentService.getUserPayments(identifier);

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
GET MY REFUNDS
*/
const getMyRefunds = async (req, res) => {
  try {
    const identifier = req.user.identifier;
    const refunds = await paymentService.getUserRefunds(identifier);

    return res.status(200).json({
      success: true,
      count: refunds.length,
      refunds,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  processRefund,
  getMyPayments,
  getMyRefunds,
};