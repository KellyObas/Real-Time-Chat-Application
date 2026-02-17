# Quick Setup Guide

This guide will help you get your Real-Time Chat Application up and running in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Basic knowledge of React

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in the details:
   - Name: `chat-app` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to you
   - Pricing Plan: Free tier is perfect for development

4. Wait for the project to be provisioned (1-2 minutes)

### 1.2 Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. You'll need two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (long JWT token)

Keep these handy - you'll need them in the next step.

### 1.3 Run Database Migrations

The database schema is automatically created when the first user signs up, thanks to our trigger functions. No manual SQL needed!

However, if you want to run the migrations manually:

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the content from the migration file in your project
3. Run the SQL script

## Step 2: Local Project Setup

### 2.1 Clone or Download the Project

```bash
# If you have Git
git clone <your-repo-url>
cd chat-app

# Or download and extract the ZIP file
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Supabase client
- Tailwind CSS
- date-fns for date formatting
- And more...

### 2.3 Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with the actual values from Step 1.2.

### 2.4 Start Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`

## Step 3: Test Your Application

### 3.1 Create Test Users

1. Open the app in your browser
2. Click "Sign up"
3. Create your first user:
   - Username: `alice`
   - Email: `alice@example.com`
   - Password: `password123` (use a real password in production!)

4. **Open a new incognito/private window**
5. Create a second user:
   - Username: `bob`
   - Email: `bob@example.com`
   - Password: `password123`

### 3.2 Test Real-Time Chat

1. In Alice's window:
   - Click on "bob" in the user list
   - Send a message: "Hi Bob!"

2. In Bob's window:
   - You should see Alice in the user list with an unread badge
   - Click on "alice"
   - You should see Alice's message instantly
   - Reply: "Hey Alice!"

3. Both windows should show messages in real-time!

### 3.3 Test Other Features

- **Online Status**: Close one browser - the other should show user as offline
- **Typing Indicator**: Start typing - the other user sees "..." animation
- **Dark Mode**: Click the moon/sun icon in the header
- **Unread Messages**: Send messages and switch between users to see unread counts
- **Message Status**: Check for "Sent", "Delivered", and "Read" statuses

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure your `.env` file exists and has the correct variable names:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_SUPABASE_ANON_KEY`

Note the `VITE_` prefix - it's required for Vite to expose the variables.

### Issue: "Can't create user" or "User already exists"

**Solution**:
1. Go to Supabase Dashboard > Authentication > Users
2. Delete any test users
3. Try creating a new user with a different email

### Issue: Messages not appearing in real-time

**Solution**:
1. Check browser console for errors
2. Verify Supabase Realtime is enabled:
   - Dashboard > Settings > API > Realtime
   - Should be ON by default
3. Check if WebSockets are blocked by firewall/proxy

### Issue: Build fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## Verify Everything Works

Use this checklist before considering setup complete:

- [ ] Two users can register successfully
- [ ] Login works for both users
- [ ] Users appear in each other's user list
- [ ] Messages send instantly (no page refresh needed)
- [ ] Online/offline status updates
- [ ] Typing indicator shows when typing
- [ ] Unread message count appears and clears when opened
- [ ] Message timestamps are correct
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile (use browser DevTools)
- [ ] Logout works correctly

## Next Steps

Now that your app is running:

1. **Customize the Design**
   - Edit color scheme in `tailwind.config.js`
   - Modify components in `src/components/`

2. **Add Features**
   - See README.md for ideas (group chat, file sharing, etc.)

3. **Deploy to Production**
   - Follow DEPLOYMENT.md for detailed instructions
   - Recommended: Deploy to Vercel or Netlify

4. **Secure Your App**
   - Review RLS policies in Supabase
   - Add rate limiting
   - Set up proper error tracking

## Getting Help

If you're stuck:

1. Check the full README.md for detailed information
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for error messages
4. Review the DEPLOYMENT.md for production issues

## Development Tips

### Hot Reload

Vite provides instant hot reload. Just save your files and see changes immediately.

### Database Changes

If you modify the database schema:
1. Create a new migration in Supabase SQL Editor
2. Update your types/interfaces in the code
3. Test with fresh test users

### Debugging

- **React DevTools**: Install browser extension for React debugging
- **Supabase Logs**: Check Dashboard > Logs for API errors
- **Network Tab**: Use browser DevTools to inspect requests

### Code Organization

The project follows a clean structure:
```
src/
├── components/     # UI components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/          # Custom React hooks
└── lib/           # Utilities (Supabase client)
```

Keep this structure when adding new features.

## Success!

If you've completed all steps, congratulations! You now have a fully functional real-time chat application.

Enjoy building and customizing your chat app!
