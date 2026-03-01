const User = require("../models/user.model");
const Order = require("../models/order.model");
const Address = require("../models/address.model");

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) return res.status(400).json({ success: false, message: "At least one field required" });
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    await req.user.save();
    return res.status(200).json({ success: true, message: "Profile updated", user: req.user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) return res.status(400).json({ success: false, message: "Latitude and longitude required" });
    req.user.location = { type: "Point", coordinates: [longitude, latitude] };
    await req.user.save();
    return res.status(200).json({ success: true, message: "Location updated", location: req.user.location });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id, isActive: true });
    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { label, fullName, phone, addressLine1, addressLine2, city, state, pincode, landmark, isDefault } = req.body;
    const address = await Address.create({
      user: req.user._id,
      label: label || "Home",
      fullName, phone, addressLine1, addressLine2,
      city, state, pincode, landmark,
      isDefault: isDefault || false,
    });
    return res.status(201).json({ success: true, message: "Address added", address });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });
    return res.status(200).json({ success: true, message: "Address updated", address });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false }, { new: true }
    );
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });
    return res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price image");
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("paymentHistory");
    return res.status(200).json({ success: true, payments: user?.paymentHistory || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};