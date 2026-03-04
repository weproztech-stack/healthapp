const {
  createOrderService,
  getMyOrdersService,
} = require("../services/order.service");
const PharmacyProduct = require("../models/pharmacyProduct.model");
const Order = require("../models/order.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

/**
 * GET /api/pharmacy/list
 */
const getProductList = async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const products = await PharmacyProduct.find(query).select(
      "name brand category description image mrp discountPrice stock prescriptionRequired"
    );

    return successResponse(res, "Products fetched successfully", {
      count: products.length,
      products,
    });
  } catch (error) {
    return errorResponse(res, error.message || "Failed to fetch products", 500);
  }
};

/**
 * POST /api/pharmacy/order
 */
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return errorResponse(res, "Unauthorized. Invalid token.", 401);
    }

    const userId = req.user._id;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !shippingAddress || !paymentMethod) {
      return errorResponse(
        res,
        "Items, shipping address and payment method are required",
        400
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, "Order must contain at least one item", 400);
    }

    // Prescription check
    for (const item of items) {
      const product = await PharmacyProduct.findById(item.product);
      if (!product) {
        return errorResponse(res, `Product not found: ${item.product}`, 404);
      }
      if (product.prescriptionRequired && !req.body.prescriptionPhoto) {
        return errorResponse(
          res,
          `Prescription required for: ${product.name}`,
          400
        );
      }
    }

    const order = await createOrderService(userId, req.body);

    return successResponse(res, "Order placed successfully", order, 201);
  } catch (error) {
    return errorResponse(res, error.message || "Server Error", 500);
  }
};

/**
 * GET /api/pharmacy/orders/my
 */
const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return errorResponse(res, "Unauthorized. Invalid token.", 401);
    }

    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getMyOrdersService(userId, page, limit);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return errorResponse(res, error.message || "Server Error", 500);
  }
};

// =====================
// ADMIN APIS
// =====================

/**
 * POST /api/admin/add-product
 */
const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      image,
      mrp,
      discountPrice,
      stock,
      prescriptionRequired,
    } = req.body;

    if (!name || !category || !mrp || !discountPrice) {
      return errorResponse(
        res,
        "name, category, mrp and discountPrice are required",
        400
      );
    }

    const product = await PharmacyProduct.create({
      name,
      brand: brand || "Clozety",
      category,
      description,
      image,
      mrp,
      discountPrice,
      stock: stock || 0,
      prescriptionRequired: prescriptionRequired || false,
    });

    return successResponse(res, "Product added successfully", product, 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to add product", 500);
  }
};

/**
 * PATCH /api/admin/update-stock
 */
const updateStock = async (req, res) => {
  try {
    const { productId, stock } = req.body;

    if (!productId || stock === undefined) {
      return errorResponse(res, "productId and stock are required", 400);
    }

    const product = await PharmacyProduct.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );

    if (!product) return errorResponse(res, "Product not found", 404);

    return successResponse(res, "Stock updated successfully", product);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update stock", 500);
  }
};

/**
 * PATCH /api/admin/order-status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return errorResponse(res, "orderId and orderStatus are required", 400);
    }

    const validStatuses = ["PLACED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(orderStatus)) {
      return errorResponse(
        res,
        "Invalid status. Must be PLACED, PACKED, SHIPPED, DELIVERED or CANCELLED",
        400
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) return errorResponse(res, "Order not found", 404);

    return successResponse(res, "Order status updated successfully", order);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to update order status", 500);
  }
};

module.exports = {
  getProductList,
  createOrder,
  getMyOrders,
  addProduct,
  updateStock,
  updateOrderStatus,
};