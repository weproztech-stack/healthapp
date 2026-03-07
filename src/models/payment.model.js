const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    /*
    Link to User
    */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
    Link to Order
    */
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    /*
    Payment amount
    */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
    Payment method
    */
    method: {
      type: String,
      enum: ["COD", "ONLINE", "UPI", "CARD", "NETBANKING"],
      required: true,
    },

    /*
    Transaction ID (for online payments)
    */
    transactionId: {
      type: String,
      default: null,
      index: true,
    },

    /*
    Payment status
    */
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "SUCCESS",
      index: true,
    },

    /*
    Refund info
    */
    refundAmount: {
      type: Number,
      default: 0,
    },

    refundReason: {
      type: String,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    /*
    Payment timestamp
    */
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


/*
Indexes for fast queries 
*/
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });


const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;