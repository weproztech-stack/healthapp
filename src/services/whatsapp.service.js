const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

// ─────────────────────────────────────────
// HELPER - Base function to send message
// ─────────────────────────────────────────
const sendWhatsApp = async (to, message) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_WHATSAPP_FROM
    ) {
      console.warn(" Twilio not configured");
      return null;
    }

    const result = await client.messages.create({
      from: FROM,
      to: `whatsapp:+91${to}`,
      body: message,
    });

    console.log(`WhatsApp sent to ${to}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(" WhatsApp error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────
// 1. NEW BOOKING ALERT - To Patient
// ─────────────────────────────────────────
const sendBookingAlert = async (phone, data) => {
  const { patientName, doctorName, date, time, bookingType } = data;

  const message =
    ` *HealthApp - Booking Confirmed!*\n\n` +
    `Hello ${patientName},\n` +
    `Your booking has been confirmed successfully.\n\n` +
    ` *Booking Details:*\n` +
    `• Type: ${bookingType}\n` +
    `• Doctor: ${doctorName}\n` +
    `• Date: ${date}\n` +
    `• Time: ${time}\n\n` +
    `_For any issues, please contact us via the app._`;

  return await sendWhatsApp(phone, message);
};

// ─────────────────────────────────────────
// 2. APPOINTMENT REMINDER - 1 day before
// ─────────────────────────────────────────
const sendAppointmentReminder = async (phone, data) => {
  const { patientName, doctorName, date, time } = data;

  const message =
    ` *HealthApp - Appointment Reminder!*\n\n` +
    `Hello ${patientName},\n` +
    `This is a reminder that you have an appointment tomorrow.\n\n` +
    ` *Appointment Details:*\n` +
    `• Doctor: Dr. ${doctorName}\n` +
    `• Date: ${date}\n` +
    `• Time: ${time}\n\n` +
    `_Please arrive on time. Thank you!_`;

  return await sendWhatsApp(phone, message);
};

// ─────────────────────────────────────────
// 3. PAYMENT CONFIRMATION - To Patient
// ─────────────────────────────────────────
const sendPaymentConfirmation = async (phone, data) => {
  const { patientName, amount, bookingType, transactionId } = data;

  const message =
    ` *HealthApp - Payment Successful!*\n\n` +
    `Hello ${patientName},\n` +
    `Your payment has been received successfully.\n\n` +
    ` *Payment Details:*\n` +
    `• Amount: ₹${amount}\n` +
    `• Service: ${bookingType}\n` +
    `• Transaction ID: ${transactionId}\n\n` +
    `_Your receipt is available in the app._`;

  return await sendWhatsApp(phone, message);
};

// ─────────────────────────────────────────
// 4. DOCTOR REPLY ALERT - To Patient
// ─────────────────────────────────────────
const sendDoctorReplyAlert = async (phone, data) => {
  const { patientName, doctorName } = data;

  const message =
    ` *HealthApp - New Message Received!*\n\n` +
    `Hello ${patientName},\n` +
    `Dr. ${doctorName} has replied to your message.\n\n` +
    `_Please open the app to view the message._`;

  return await sendWhatsApp(phone, message);
};

module.exports = {
  sendBookingAlert,
  sendAppointmentReminder,
  sendPaymentConfirmation,
  sendDoctorReplyAlert,
};