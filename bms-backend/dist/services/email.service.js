"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTicketEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const googleapis_1 = require("googleapis");
const OAuth2 = googleapis_1.google.auth.OAuth2;
const createTransporter = async () => {
    const oauth2Client = new OAuth2(config_1.config.gmailClientId, config_1.config.gmailClientSecret, config_1.config.gmailRedirectUri);
    oauth2Client.setCredentials({
        refresh_token: config_1.config.gmailRefreshToken,
    });
    const accessToken = await oauth2Client.getAccessToken();
    return nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config_1.config.emailUsername,
            clientId: config_1.config.gmailClientId,
            clientSecret: config_1.config.gmailClientSecret,
            refreshToken: config_1.config.gmailRefreshToken,
            accessToken: accessToken.token || undefined,
        },
    });
};
const sendTicketEmail = async (data) => {
    const transporter = await createTransporter();
    const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>🎬 Movie Ticket Confirmed</h2>

      <p><b>Booking ID:</b> ${data.bookingId}</p>
      <p><b>Movie:</b> ${data.movie}</p>
      <p><b>Seats:</b> ${data.seats.join(", ")}</p>
      <p><b>Show Time:</b> ${data.showTime || "N/A"}</p>

      <hr />
      <p>Enjoy your movie 🍿</p>
    </div>
  `;
    await transporter.sendMail({
        from: `"MovieTickets" <${config_1.config.emailUsername}>`,
        to: data.to,
        subject: "🎟️ Your Ticket Confirmation",
        html,
    });
    console.log("📧 Email sent to:", data.to);
};
exports.sendTicketEmail = sendTicketEmail;
