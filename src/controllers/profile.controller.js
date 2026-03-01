const profileService = require("../services/profile.service");

/* =========================
   GET PROFILE
========================= */
const getProfile = async (req, res) => {
  try {
    const user = await profileService.getProfileService(req.user._id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE PROFILE
========================= */
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await profileService.updateProfileService(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADD ADDRESS
========================= */
const addAddress = async (req, res) => {
  try {
    const address = await profileService.addAddressService(
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ADDRESSES
========================= */
const getAddresses = async (req, res) => {
  try {
    const addresses = await profileService.getAddressesService(req.user._id);

    return res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE ADDRESS
========================= */
const deleteAddress = async (req, res) => {
  try {
    const result = await profileService.deleteAddressService(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   SET DEFAULT ADDRESS
========================= */
const setDefaultAddress = async (req, res) => {
  try {
    const address = await profileService.setDefaultAddressService(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
};