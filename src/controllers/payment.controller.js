const paymentService = require("../services/payment.service");

/*
CREATE PAYMENT
*/
const createPayment = async (req, res) => {
  try {

    const identifier = req.user.identifier;

    const payment = await paymentService.createPayment(
      identifier,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
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
  getMyPayments,
  getMyRefunds,
};