# Automated Email Reminders Backend

A serverless backend for automated email reminders built with Node.js, Express, and MongoDB, optimized for Vercel deployment.

## Features

- ✅ **Serverless Architecture** - Optimized for Vercel deployment
- ✅ **Automated Email Processing** - Using Vercel Cron Jobs
- ✅ **User Authentication** - JWT-based authentication
- ✅ **Admin Dashboard** - User management and analytics
- ✅ **Email Templates** - Professional HTML email templates
- ✅ **Error Handling** - Comprehensive error tracking

## Serverless Email Scheduling

This application uses **Vercel Cron Jobs** instead of traditional cron jobs, making it compatible with serverless environments.

### How it works:

1. **Vercel Cron Job** runs every minute (`* * * * *`)
2. **HTTP Request** is made to `/api/reminders/process-due`
3. **Email Processing** checks for due reminders and sends emails
4. **Status Updates** are saved to the database

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password

# Vercel Cron Security
CRON_SECRET=your_cron_secret_key

# Client URL
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## Email Setup

### Gmail Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in `EMAIL_PASS`

## Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect the Node.js app

### Cron Job Setup

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reminders/process-due",
      "schedule": "* * * * *"
    }
  ]
}
```

This runs every minute and processes due reminders.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Reminders
- `GET /api/reminders` - Get user's reminders
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder
- `POST /api/reminders/process-due` - Process due reminders (cron endpoint)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/reminders` - Get all reminders (admin only)
- `GET /api/admin/stats` - Get system statistics (admin only)

## Alternative Solutions

If you prefer other scheduling solutions:

### 1. External Cron Services
- **GitHub Actions** - Free cron jobs
- **AWS EventBridge** - Cloud cron service
- **Cron-job.org** - Free web-based cron

### 2. Database-Triggered Processing
- Process reminders on-demand when users access the app
- Use database triggers for immediate processing

### 3. Third-Party Email Services
- **SendGrid** - Advanced email scheduling
- **Mailgun** - Email API with scheduling
- **Resend** - Modern email API

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The cron job won't run locally, but you can test the endpoint:
curl -X POST http://localhost:5000/api/reminders/process-due \
  -H "Authorization: Bearer your_cron_secret"
```

## Monitoring

- Check Vercel function logs for cron job execution
- Monitor email delivery in your Gmail sent folder
- Database logs show processed reminders

## Troubleshooting

### Cron Job Not Running
1. Check Vercel deployment logs
2. Verify `CRON_SECRET` environment variable
3. Ensure the endpoint returns 200 status

### Emails Not Sending
1. Verify Gmail credentials
2. Check app password is correct
3. Ensure Gmail account has 2FA enabled

### Database Connection Issues
1. Verify MongoDB connection string
2. Check network connectivity
3. Ensure database user has proper permissions 