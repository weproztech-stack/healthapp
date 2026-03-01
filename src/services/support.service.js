const Support = require("../models/support.model");
const User = require("../models/user.model");


/*
CREATE SUPPORT TICKET
*/
exports.createTicket = async (identifier, data) => {

  const { subject, message } = data;

  if (!subject || !message) {
    throw new Error("Subject and message required");
  }

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const ticket = await Support.create({
    user: user._id,
    subject,
    message,
  });

  return ticket;
};



/*
GET USER TICKETS
*/
exports.getUserTickets = async (identifier) => {

  const user = await User.findOne({ phone: identifier });

  if (!user) {
    throw new Error("User not found");
  }

  const tickets = await Support.find({ user: user._id })
    .sort({ createdAt: -1 });

  return tickets;
};