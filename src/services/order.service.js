const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Address = require("../models/address.model");

/**
 * Create Order Service (Production Safe)
 */
const createOrderService = async (userId, orderData) => {
  const { items, shippingAddress, paymentMethod } = orderData;

  // 🔥 Validate shipping address belongs to user
  const address = await Address.findOne({
    _id: shippingAddress,
    user: userId,
  });

  if (!address) {
    throw new Error("Invalid shipping address");
  }

  // 🔥 Recalculate total amount (NEVER trust client total)
  const calculatedTotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    totalAmount: calculatedTotal,
    paymentMethod,
  });

  return order;
};

/**
 * Get My Orders (Paginated + Optimized)
 */
const getMyOrdersService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .populate("items.product", "name price")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), // 🔥 performance boost

    Order.countDocuments({ user: userId }),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    count: orders.length,
    data: orders,
  };
};

module.exports = {
  createOrderService,
  getMyOrdersService,
};