import { Resend } from "resend";
import { env } from "../configs/env";

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

// Fire-and-forget by design: callers should NOT await this in a way
// that blocks the HTTP response. Failures are logged, not thrown,
// so a flaky email provider never breaks a booking/confirm/cancel flow.
export const sendEmail = ({ to, subject, html }: SendEmailArgs): void => {
  resend.emails
    .send({ from: env.EMAIL_FROM, to, subject, html })
    .catch((err) => {
      console.error(`Failed to send email to ${to}:`, err);
    });
};

const formatRange = (start: string, end: string) =>
  `${new Date(start).toLocaleString()} – ${new Date(end).toLocaleTimeString()}`;

export const emailTemplates = {
  bookingRequestedCustomer: (restaurantName: string, start: string, end: string) => ({
    subject: `Booking request received — ${restaurantName}`,
    html: `<p>We've sent your booking request for <strong>${restaurantName}</strong> at ${formatRange(start, end)} to the restaurant. You'll get another email once they confirm.</p>`,
  }),
  bookingRequestedOwner: (customerName: string, start: string, end: string) => ({
    subject: `New booking request`,
    html: `<p><strong>${customerName}</strong> has requested a table for ${formatRange(start, end)}. Log in to confirm or decline.</p>`,
  }),
  bookingConfirmed: (restaurantName: string, start: string, end: string) => ({
    subject: `Booking confirmed — ${restaurantName}`,
    html: `<p>Your booking at <strong>${restaurantName}</strong> for ${formatRange(start, end)} is confirmed. See you then!</p>`,
  }),
  bookingRejected: (restaurantName: string, start: string, end: string) => ({
    subject: `Booking declined — ${restaurantName}`,
    html: `<p>Unfortunately <strong>${restaurantName}</strong> couldn't accommodate your request for ${formatRange(start, end)}. Try another time slot.</p>`,
  }),
  bookingCancelled: (restaurantName: string, start: string, end: string) => ({
    subject: `Booking cancelled — ${restaurantName}`,
    html: `<p>The booking for ${formatRange(start, end)} at <strong>${restaurantName}</strong> has been cancelled.</p>`,
  }),
};