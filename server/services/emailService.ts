import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface OrderData {
  id: string;
  customer_name: string;
  email: string;
  address: string;
  phone: string;
  items: string;
  total_price: number;
  status: string;
  created_at?: string;
}

let transporter: Transporter | null = null;

// Initialize nodemailer transporter
export function initializeMailer(): Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  transporter = nodemailer.createTransport(smtpConfig);
  return transporter;
}

// Test the SMTP connection
export async function testMailerConnection(): Promise<boolean> {
  try {
    const mailer = initializeMailer();
    await mailer.verify();
    console.log("✓ SMTP connection verified");
    return true;
  } catch (error) {
    console.error(
      "✗ SMTP verification failed:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

// Send order confirmation email
export async function sendOrderConfirmation(
  order: OrderData,
  htmlContent: string,
): Promise<boolean> {
  try {
    const mailer = initializeMailer();

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || "noreply@thobe-store.com",
      to: order.email,
      subject: `Order Confirmation - #${order.id}`,
      html: htmlContent,
      replyTo: process.env.SMTP_REPLY_TO || "support@thobe-store.com",
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(
      `✓ Order confirmation email sent to ${order.email} (${info.messageId})`,
    );
    return true;
  } catch (error) {
    console.error(
      `✗ Failed to send email to ${order.email}:`,
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

// Send test email (for verification)
export async function sendTestEmail(
  toEmail: string,
  subject: string,
  htmlContent: string,
): Promise<string | null> {
  try {
    const mailer = initializeMailer();

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || "noreply@thobe-store.com",
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(`✓ Test email sent to ${toEmail} (${info.messageId})`);
    return info.messageId;
  } catch (error) {
    console.error(
      `✗ Failed to send test email to ${toEmail}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
