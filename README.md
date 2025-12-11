# Spark! Bytes

A full-stack web application for sharing and discovering free food opportunities at Boston University. Built with Next.js (React) frontend and Express.js (TypeScript) backend.

## Project Structure

```
Spark-Bytes-Team-3/
├── client/          # Next.js frontend application
└── server/          # Express.js backend API
```

## Features

- **Separate Authentication**: Student login and admin login pages
- **Google OAuth Integration**: Sign in with Google (requires @bu.edu email)
- **Role-Based Access**: Students can view and reserve food; Admins can create, edit, and delete events
- **BU Email Validation**: Only @bu.edu email addresses allowed
- **Event Management**: Create, browse, and filter food events
- **Reservation System**: Students can reserve food from events
- **Dietary Preferences**: Filter events by dietary restrictions
- **Image Upload**: Upload event photos (local storage)
- **Feedback System**: Rate and comment on events
- **Notifications**: Email notifications for new events (opt-in/out)
- **Analytics Dashboard**: Admin-only analytics and statistics
- **Modern UI**: Built with Material UI

## User Roles

### Students
- View and browse events
- Reserve food from events
- Leave feedback on events they reserved
- Set dietary preferences
- Manage reservations

### Admins
- Create, edit, and delete events
- Upload event images
- View analytics dashboard
- Manage organizer verification
- Cannot reserve food (view-only for reservations)

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14 (React 18)
- **UI Library**: Material UI
- **Styling**: Material UI (no Tailwind CSS)
- **Language**: TypeScript
- **Database Client**: Prisma

### Backend (Server)
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL via Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer (local storage)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/liam-py/Spark-Bytes-Team-3.git
cd Spark-Bytes-Team-3
```

2. Set up the backend:
```bash
cd server
npm install
npm run prisma:gen
```

3. Set up the frontend:
```bash
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="your-secret-key-here"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Note**: 
- Get your Supabase connection string from your Supabase project settings (Settings > Database > Connection string - use Session Pooler for IPv4 compatibility)
- Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services > Credentials)

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

### Running the Application

1. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Get your database connection string from Settings > Database
   - Add it to your `.env` file as `DATABASE_URL`

2. Run database migrations:
```bash
cd server
npm install dotenv
npm run prisma:migrate
```

3. Start the backend server (from `server/` directory):
```bash
npm run dev
```
The API will run on `http://localhost:4000`

3. Start the frontend development server (from `client/` directory):
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

## Authentication

### Student Login
- **URL**: `/login`
- **Features**: Login and signup for BU students
- **Authentication Methods**: 
  - Email/password login
  - Google OAuth sign-in (requires @bu.edu email)
- **Access**: View events, make reservations, manage profile
- **Redirect**: Home page after login

### Admin Login
- **URL**: `/admin/login`
- **Features**: Login only (no signup)
- **Authentication Methods**:
  - Email/password login
  - Google OAuth sign-in (requires @bu.edu email and ADMIN role)
- **Access**: Create/edit/delete events, view analytics
- **Redirect**: Admin analytics dashboard after login

**Note**: 
- Admins must use the admin login page. Students cannot access admin features.
- Google OAuth requires configuring redirect URI `http://localhost:3000` in Google Cloud Console.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new student (BU email required)
- `POST /auth/login` - Login with email/password (students or admins)
- `POST /auth/google` - Login with Google OAuth (requires @bu.edu email)
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout

### Events
- `GET /api/events` - List all events (public)
- `GET /api/events/:id` - Get event details (public)
- `POST /api/events` - Create event (admin/organizer only)
- `PUT /api/events/:id` - Update event (admin or creator)
- `DELETE /api/events/:id` - Delete event (admin or creator)

### Reservations
- `POST /api/reservations` - Create reservation (students only)
- `GET /api/reservations` - Get user's reservations (students only)
- `DELETE /api/reservations/:id` - Cancel reservation

### Other Endpoints
- `GET /api/dietary` - Get dietary preferences
- `PUT /api/dietary` - Update dietary preferences
- `POST /api/feedback` - Submit feedback (students only)
- `GET /api/feedback/event/:eventId` - Get event feedback
- `POST /api/upload` - Upload image (admin/organizer only)
- `PUT /api/notifications/preferences` - Update notification preferences
- `GET /api/analytics/overview` - Get analytics (admin only)

## Development

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:gen` - Generate Prisma client

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC
