# Setup & Configuration Guide

## Environment Variables

### Server (.env)

All required environment variables are now included in `.env`. Key variables to configure before running:

1. **JWT Secrets** (CRITICAL for production):
   ```
   JWT_ACCESS_SECRET=your_secure_random_string
   JWT_REFRESH_SECRET=your_secure_random_string
   ```
   Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Google OAuth** (for Google login):
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
   See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for detailed instructions.

3. **Email Service** (optional for development):
   ```
   SENDGRID_API_KEY=your_api_key
   EMAIL_FROM=noreply@activitycrew.com
   ```
   Note: Email verification is currently disabled in development mode. 
   TODO: Implement EmailService integration for production.

4. **Database**:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ActivityCrew-Final
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

### Client (.env)

Frontend configuration in `client/activityCrew/.env`:

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Quick Start

1. **Server Setup**:
   ```bash
   cd server
   npm install
   # Configure .env file with your values
   npm start
   ```

2. **Client Setup**:
   ```bash
   cd client/activityCrew
   npm install
   # Configure .env file with your values
   npm run dev
   ```

## Recent Fixes

### ✅ Fixed Issues

1. **Added Missing JWT Refresh Token Configuration**
   - `JWT_REFRESH_SECRET` now required
   - `JWT_ACCESS_EXPIRY` and `JWT_REFRESH_EXPIRY` configured

2. **Created .env.example Files**
   - `server/.env.example` - Template for server configuration
   - `client/activityCrew/.env.example` - Template for client configuration

3. **Enabled Account Lockout Security**
   - Failed login attempts now tracked in User model
   - Account automatically locked after 5 failed attempts (30-minute lockout)
   - Login attempts reset on successful login

4. **Added Email Verification Check**
   - Email verification enforced in production environment
   - Disabled in development for easier testing

### ⏰ TODO: Future Implementation

1. **Email Service** - Implement EmailService for:
   - Email verification on registration
   - Password reset emails
   - Notification emails

2. **Real-time Chat**
   - WebSocket/Socket.IO implementation needed
   - Currently only REST endpoints exist

3. **Rate Limiting**
   - Configuration added but not yet middleware-integrated

4. **Test Suite**
   - Full test coverage needed for all services

## Security Checklist for Production

- [ ] Generate strong random JWT secrets
- [ ] Set up Google OAuth credentials
- [ ] Configure email service (Sendgrid or similar)
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Rotate JWT secrets regularly
- [ ] Review database backups
- [ ] Monitor rate limiting

## Troubleshooting

**"Invalid email or password" on every login attempt:**
- Check if account is locked (5 failed attempts = 30-min lockout)
- Verify `JWT_REFRESH_SECRET` is set in `.env`

**Email verification not working:**
- Email service is currently a TODO feature
- In development, email verification is bypassed
- For production, implement EmailService integration

**Google OAuth not working:**
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for setup steps

---

For more information, see the project documentation and respective README files in `client/` and `server/` directories.
