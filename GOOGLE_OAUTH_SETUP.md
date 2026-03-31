# Google OAuth 2.0 Setup & Testing Guide

## Prerequisites Completed ✅

- `@react-oauth/google` library installed
- Backend OAuth endpoint created (`/api/auth/google`)
- Environment variables configured
- All auth flows updated to use Google OAuth

## IMPORTANT: Google Cloud Console Setup Required

Before testing, you MUST configure your Google OAuth app:

### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **Credentials**

### Step 2: Update Authorized JavaScript Origins
1. Click on your OAuth 2.0 Client ID (Web application)
2. Add these Authorized JavaScript Origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`

3. Click **Save**

### Step 3: Update Authorized Redirect URIs (if needed)
Add these redirect URIs if they're not already there:
- `http://localhost:5173`
- `http://localhost:5000`

## Starting the Servers

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```
You should see: `Server is running on port 5000`

### Terminal 2: Start Frontend
```bash
cd client/activityCrew
npm run dev
```
You should see: `Local: http://localhost:5173/`

## Testing Google Sign In

1. Open browser and go to `http://localhost:5173`
2. Click **"Sign in"** or **"Sign up"**
3. Click **"Continue with Google"** button
4. Google login popup should appear
5. Sign in with your Google account
6. You should be redirected to the main app

## Expected Console Output

### Frontend Console (F12)
✅ Successful flow:
```
Google login successful
```

❌ If you see errors:
```
CORS error: Origins not authorized
Invalid token error
```

### Backend Console
✅ Successful user creation:
```
User created successfully: [user-id]
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Origins not authorized" popup** | Add `http://localhost:5173` to Google Cloud Console Authorized JavaScript Origins |
| **CORS errors in browser console** | Backend is treating request correctly. Check Google Cloud config |
| **"Invalid token" from backend** | Google Cloud Client ID doesn't match hardcoded ID. Verify in .env |
| **Blank screen after login** | Check browser console (F12) for errors, check backend logs |
| **Database error when creating user** | Ensure PostgreSQL is running and database is connected |

## Environment Variables

Frontend (`.env`):
```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_API_URL=http://localhost:5000
```

Backend (`.env`):
```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

## What Happens Behind the Scenes

1. **Frontend**: User clicks "Sign with Google" → `useGoogleLogin` hook opens Google auth popup
2. **Google**: User authorizes → Google returns access token
3. **Frontend**: Sends access token to backend at `POST /api/auth/google`
4. **Backend**: Validates token with Google's servers using `https://www.googleapis.com/oauth2/v2/userinfo`
5. **Backend**: Creates/finds user with Google email, returns JWT
6. **Frontend**: Stores JWT, redirects to main app

## Files Modified

- `client/activityCrew/.env` - Added Google credentials
- `client/activityCrew/vite.config.js` - Set port to 5173
- `client/activityCrew/src/App.jsx` - Wrapped with GoogleOAuthProvider
- `client/activityCrew/src/components/auth/SignInScreen.jsx` - Integrated Google login
- `client/activityCrew/src/components/auth/SignUpScreen.jsx` - Integrated Google signup
- `server/.env` - Added Google credentials
- `server/controllers/authController.js` - Added googleAuth function
- `server/routes/authRoutes.js` - Added /google route

## Testing Checklist

- [ ] Google Cloud Console has `http://localhost:5173` authorized
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Click Google button, popup appears
- [ ] Sign in with Google account
- [ ] User created in database
- [ ] JWT stored in localStorage
- [ ] Redirected to main app
