const User = require("../models/user.model");
const Address = require("../models/address.model");
const Order = require("../models/order.model");

/* =========================
   GET PROFILE
========================= */
const getProfileService = async (userId) => {
  const user = await User.findById(userId)
    .select("name email phone role profileImage isVerified")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/* =========================
   UPDATE PROFILE
========================= */
const updateProfileService = async (userId, data) => {
  const { name, email } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  return user.toSafeObject();
};

/* =========================
   ADD ADDRESS
========================= */
const addAddressService = async (userId, data) => {
  const address = await Address.create({
    user: userId,
    ...data,
  });

  return address.toSafeObject();
};

/* =========================
   GET ADDRESSES
========================= */
const getAddressesService = async (userId) => {
  const addresses = await Address.find({
    user: userId,
    isActive: true,
  })
    .sort({ isDefault: -1 })
    .lean();

  return addresses;
};

/* =========================
   DELETE ADDRESS (Soft Delete)
========================= */
const deleteAddressService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  address.isActive = false;
  await address.save();

  return { message: "Address deleted successfully" };
};

/* =========================
   SET DEFAULT ADDRESS
========================= */
const setDefaultAddressService = async (userId, addressId) => {
  await Address.updateMany(
    { user: userId },
    { isDefault: false }
  );

  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { isDefault: true },
    { new: true }
  );

  if (!address) {
    throw new Error("Address not found");
  }

  return address.toSafeObject();
};

module.exports = {
  getProfileService,
  updateProfileService,
  addAddressService,
  getAddressesService,
  deleteAddressService,
  setDefaultAddressService,
};