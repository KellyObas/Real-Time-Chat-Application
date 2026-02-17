# Real-Time Chat Application

A production-ready real-time chat application built with React and Supabase, featuring instant messaging, online presence, typing indicators, and dark mode support.

## Features

### Authentication
- User registration with username, email, and password
- Secure login with Supabase Auth
- JWT-based authentication
- Automatic profile creation on signup
- Session persistence

### Chat Features
- One-to-one private messaging
- Real-time message delivery (no refresh needed)
- Message history persistence
- Online/offline status indicators
- Typing indicators
- Message timestamps
- Unread message counters
- Message read/delivered status
- Auto-scroll to latest message

### UI Features
- Clean, modern WhatsApp-like interface
- Dark mode support with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Avatar generation from username
- Loading states and error handling

## Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **date-fns** - Date formatting
- **React Icons** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication

## Database Schema

### Tables

#### profiles
- Extends auth.users with additional user information
- Stores username, email, avatar, online status
- Automatically created via trigger on user signup

#### conversations
- Tracks private conversations between two users
- Prevents duplicate conversations
- Timestamps for sorting

#### messages
- Stores all chat messages
- Includes read/delivered status
- Linked to conversations and users

#### typing_indicators
- Real-time typing status
- Unique per user per conversation
- Auto-expires after 2 seconds

## Security

All tables use Row Level Security (RLS) with policies ensuring:
- Users can only access their own data
- Messages only visible to conversation participants
- Profile updates restricted to own profile
- Comprehensive authentication checks

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Create a `.env` file with your credentials
   - The database schema is automatically created via migrations

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx          # Login form
│   │   │   └── Register.jsx       # Registration form
│   │   └── Chat/
│   │       ├── ChatWindow.jsx     # Main chat interface
│   │       ├── MessageInput.jsx   # Message input with typing
│   │       ├── MessageList.jsx    # Message display
│   │       └── UserList.jsx       # User sidebar
│   ├── contexts/
│   │   └── AuthContext.jsx        # Auth state management
│   ├── hooks/
│   │   ├── useDarkMode.js         # Dark mode hook
│   │   └── useUnreadMessages.js   # Unread count hook
│   ├── lib/
│   │   └── supabase.js            # Supabase client
│   └── App.jsx                    # Main app component
├── index.js                        # App entry point
├── index.html                      # HTML template
├── style.css                       # Global styles with Tailwind
├── tailwind.config.js              # Tailwind configuration
└── postcss.config.js               # PostCSS configuration
```

## Usage

### Registration
1. Click "Sign up" on the login page
2. Enter username, email, and password
3. Automatically logged in after successful registration

### Sending Messages
1. Select a user from the sidebar
2. Type your message in the input field
3. Press Enter or click Send
4. Messages appear instantly for both users

### Features in Action
- **Online Status**: Green dot indicates user is online
- **Typing Indicator**: See when someone is typing
- **Unread Messages**: Red badge shows unread count
- **Message Status**: Shows if message is sent/delivered/read
- **Dark Mode**: Toggle in header (remembers preference)

## Real-time Updates

The app uses Supabase Realtime for instant updates:
- New messages appear immediately
- Online status updates in real-time
- Typing indicators show live
- Unread counts update automatically

## Responsive Design

- **Mobile**: Full-screen chat with slide-out sidebar
- **Tablet**: Side-by-side layout
- **Desktop**: Optimized three-column layout

## Production Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables
Remember to add your Supabase credentials to your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_SUPABASE_ANON_KEY`

## Performance Optimizations

- Lazy loading of messages
- Debounced typing indicators
- Optimistic UI updates
- Connection pooling
- Indexed database queries
- Minimal re-renders with proper React optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- One-to-one chat only (no group chats)
- Text messages only (no file uploads in this version)
- No message editing or deletion
- No message search functionality

## Future Enhancements

- Group chat support
- File and image sharing
- Voice messages
- Video calling
- Message reactions
- End-to-end encryption
- Push notifications
- Message search
- User blocking

## Troubleshooting

### Messages not appearing
- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors

### Can't login
- Verify email/password are correct
- Check Supabase Auth settings
- Ensure database migrations ran successfully

### Typing indicator not working
- Check real-time subscriptions
- Verify typing_indicators table exists
- Check console for WebSocket errors

## License

MIT License - feel free to use this project for learning or production.

## Credits

Built with React, Supabase, and Tailwind CSS.
