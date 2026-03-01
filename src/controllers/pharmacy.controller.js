const {
  createOrderService,
  getMyOrdersService,
} = require("../services/order.service");

/**
 * @desc    Create new pharmacy order
 * @route   POST /api/pharmacy/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Invalid token.",
      });
    }

    const userId = req.user._id;

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Items, shipping address and payment method are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const order = await createOrderService(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/**
 * @desc    Get logged-in user's orders (Paginated)
 * @route   GET /api/pharmacy/orders/my
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Invalid token.",
      });
    }

    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getMyOrdersService(userId, page, limit);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};