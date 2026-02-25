# Email Confirmation Setup Guide

This guide explains how to set up and configure the order confirmation email feature using nodemailer.

## Overview

When a customer places an order, the system automatically sends a confirmation email with:

- Order ID and details
- Itemized list of products
- Shipping address and phone number
- Order status
- Estimated delivery date
- Link to track order

## Installation

nodemailer is already included in `package.json`. If you need to install it manually:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Configuration

The email service requires environment variables to be configured. Copy `.env.example` to `.env` and fill in your email settings.

### Option 1: Using Ethereal Email (Development/Testing)

Ethereal Email is a fake SMTP service perfect for development and testing.

1. Go to [https://ethereal.email](https://ethereal.email)
2. Click "Create Ethereal Account"
3. Copy your credentials and update `.env`:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-account@ethereal.email
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@thobe-store.com
SMTP_REPLY_TO=support@thobe-store.com
CUSTOMER_PORTAL_URL=https://yourdomain.com
```

4. Sent emails will be viewable at [https://ethereal.email](https://ethereal.email) - check your account for the "View Message" links

### Option 2: Using Gmail (Production)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Update `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_REPLY_TO=support@thobe-store.com
CUSTOMER_PORTAL_URL=https://yourdomain.com
```

### Option 3: Using SendGrid (Production)

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create an API key from Settings > API Keys
3. Update `.env`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-api-key-here
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_REPLY_TO=support@yourdomain.com
CUSTOMER_PORTAL_URL=https://yourdomain.com
```

### Option 4: Using AWS SES (Production)

1. Set up AWS SES in your desired region
2. Create SMTP credentials from the SES console
3. Update `.env`:

```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=verified-email@yourdomain.com
SMTP_REPLY_TO=support@yourdomain.com
CUSTOMER_PORTAL_URL=https://yourdomain.com
```

## Environment Variables

### Required

- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (usually 587 or 465)
- `SMTP_SECURE` - Use TLS (true for 465, false for 587)
- `SMTP_USER` - SMTP authentication username
- `SMTP_PASSWORD` - SMTP authentication password

### Optional

- `SMTP_FROM_EMAIL` - From address (default: `noreply@thobe-store.com`)
- `SMTP_REPLY_TO` - Reply-to address (default: `support@thobe-store.com`)
- `CUSTOMER_PORTAL_URL` - Base URL for order tracking links (default: `https://yourdomain.com`)

## Testing the Email Setup

### Using the Test Endpoint

Once configured, test your email setup:

```bash
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "testMessage": "This is a test"
  }'
```

Response example:

```json
{
  "success": true,
  "message": "Test email sent successfully",
  "data": {
    "recipientEmail": "test@example.com",
    "orderId": "test-1708876800000",
    "note": "Check your Ethereal Email inbox at https://ethereal.email"
  }
}
```

### Manual Testing

When you create an order via the API, the system will automatically send a confirmation email. To test:

1. Create an order:

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "phone": "+1 (555) 123-4567",
    "items": [
      {
        "name": "Premium Thobe",
        "quantity": 1,
        "price": 89.99,
        "size": "L"
      }
    ],
    "total_price": 89.99
  }'
```

2. If using Ethereal Email, check your account at https://ethereal.email for the confirmation email
3. If using other providers, check the inbox of `SMTP_FROM_EMAIL`

## File Structure

### Email Service Files

- **`server/services/emailService.ts`** - Core email service with:
  - `initializeMailer()` - Initialize nodemailer transporter
  - `testMailerConnection()` - Verify SMTP connection
  - `sendOrderConfirmation()` - Send order confirmation email
  - `sendTestEmail()` - Send test email

- **`server/utils/emailTemplate.ts`** - Email template utilities with:
  - `formatOrderForEmail()` - Format order data for email template
  - `getOrderConfirmationHTML()` - Generate HTML email content

### Integration Points

- **`server/routes/orders.ts`** - Order creation endpoint now:
  - Imports email service and template utilities
  - Sends confirmation email asynchronously after order creation
  - Doesn't block order response if email fails

- **`server/index.ts`** - Server configuration with:
  - `/api/test-email` endpoint for testing email setup

## Error Handling

The email confirmation system includes robust error handling:

1. **Email failures don't block order creation** - Orders are saved successfully even if email sending fails
2. **Async email sending** - Emails are sent asynchronously using `setImmediate` to avoid blocking HTTP responses
3. **Connection verification** - The system logs SMTP connection status on startup
4. **Detailed error logging** - All email errors are logged to console with helpful messages

## Production Considerations

1. **Environment Variables** - Store sensitive credentials in environment variables, never commit them
2. **Email Verification** - For production SMTP providers (Gmail, SendGrid, AWS SES), verify your sender email
3. **Rate Limiting** - Consider implementing rate limiting if you expect high order volumes
4. **Email Templates** - Customize the HTML template in `emailTemplate.ts` to match your branding
5. **Monitoring** - Log email sending status for monitoring and debugging

## Troubleshooting

### "Failed to connect to SMTP server"

- Verify SMTP credentials are correct
- Check if the SMTP server is accessible from your network
- Ensure SMTP_PORT matches your provider (usually 587 or 465)
- For Ethereal, ensure you've created an account at https://ethereal.email

### "Email sent but not received"

- Check spam/junk folder
- Verify the recipient email address is correct
- For custom domains, ensure SPF/DKIM records are configured
- Check email provider's delivery logs

### "Module not found" errors

- Ensure `nodemailer` is installed: `npm install nodemailer`
- Ensure `@types/nodemailer` is installed: `npm install --save-dev @types/nodemailer`
- Rebuild types with: `npm run build:server`

### Environment variables not loading

- Ensure `.env` file exists in project root (copy from `.env.example`)
- Restart the server after updating `.env`
- Verify `dotenv` is imported and `dotenv.config()` is called before other code

## Customization

### Changing Email Template

Edit `server/utils/emailTemplate.ts` to modify:

- Email subject line (currently: `Order Confirmation - #${order.id}`)
- HTML template design and styling
- Email header/footer content
- Product table layout

### Changing From/Reply-To Addresses

Update in `.env`:

```env
SMTP_FROM_EMAIL=your-custom-email@domain.com
SMTP_REPLY_TO=support@domain.com
```

### Using Email Templates

To send custom emails, use the `sendTestEmail()` function:

```typescript
import { sendTestEmail } from "../services/emailService";
import {
  getOrderConfirmationHTML,
  formatOrderForEmail,
} from "../utils/emailTemplate";

const order = {
  /* ... */
};
const formattedOrder = formatOrderForEmail(order);
const html = getOrderConfirmationHTML(formattedOrder);

await sendTestEmail(customerEmail, "Your Subject", html);
```

## Support

For issues with:

- **Nodemailer** - Check [Nodemailer documentation](https://nodemailer.com)
- **Your SMTP provider** - Consult their documentation and support
- **Order API** - See API documentation in README.md
