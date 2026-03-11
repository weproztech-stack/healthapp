
const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Address = require("../models/address.model");
const notify = require("./notification.service"); 

/**
 * Create Order Service (Production Safe)
 */
const createOrderService = async (userId, orderData) => {
  const { items, shippingAddress, paymentMethod } = orderData;

  const address = await Address.findOne({
    _id: shippingAddress,
    user: userId,
  });

  if (!address) {
    throw new Error("Invalid shipping address");
  }

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

  //  SAHI JAGAH - Order create hone ke BAAD notification
  await notify.notifyOrderStatus(
    userId,
    "Packed",
    order._id
  );

  return order;
};

/**
 * Update Order Status + Notification
 */
const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) throw new Error("Order not found");

  //  Status change hone pe notification
  await notify.notifyOrderStatus(
    order.user,
    status,
    order._id
  );

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
      .lean(),

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
  updateOrderStatusService, 
}