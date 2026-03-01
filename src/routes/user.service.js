const User = require("../models/user.model");
exports.updateUserProfile = async (identifier, data) => {
  const { name, email } = data;
  if (!name && !email) {
    throw new Error("At least one field (name or email) is required");
  }

  // Find user by phone (identifier from token)
  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  // Update allowed fields only
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  return user.toSafeObject();
};

exports.updateUserLocation = async (identifier, latitude, longitude) => {

  // Validate input
  if (latitude === undefined || longitude === undefined) {
    throw new Error("Latitude and longitude are required");
  }

  // Find user by phone (same identifier logic)
  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  // Update location safely
  user.location = {
    type: "Point",
    coordinates: [longitude, latitude],
    updatedAt: new Date(),
  };

  await user.save();

  return user.location;
};