import nodemailer from "nodemailer";
import { config } from "../config/config";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    config.gmailClientId,
    config.gmailClientSecret,
    config.gmailRedirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: config.gmailRefreshToken,
  });

  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.emailUsername,
      clientId: config.gmailClientId,
      clientSecret: config.gmailClientSecret,
      refreshToken: config.gmailRefreshToken,
      accessToken: accessToken.token || undefined,
    },
  });
};

export const sendTicketEmail = async (data: {
  to: string;
  movie: string;
  seats: string[];
  showTime?: string;
  bookingId: string;
}) => {
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
    from: `"MovieTickets" <${config.emailUsername}>`,
    to: data.to,
    subject: "🎟️ Your Ticket Confirmation",
    html,
  });
  console.log("📧 Email sent to:", data.to);
};