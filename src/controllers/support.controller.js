const supportService = require("../services/support.service");


exports.createTicket = async (req, res) => {

  try {

    const identifier = req.user.identifier;

    const ticket = await supportService.createTicket(
      identifier,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Support ticket created",
      ticket,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};



exports.getMyTickets = async (req, res) => {

  try {

    const identifier = req.user.identifier;

    const tickets = await supportService.getUserTickets(
      identifier
    );

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};