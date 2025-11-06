# Spark! Bytes - Client

Next.js frontend application for Spark! Bytes - a platform for sharing and discovering free food opportunities at Boston University.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **React**: 18.3.1
- **UI Components**: [Material UI](https://mui.com/) 5.15.15
- **Language**: TypeScript 5
- **Database Client**: Prisma 6.18.0
- **Authentication**: JWT with httpOnly cookies
- **Charts**: Recharts 2.12.7

## Features

- **Separate Login Pages**: Student login (`/login`) and admin login (`/admin/login`)
- **Google OAuth Integration**: Sign in with Google button on both login pages
- **Role-Based Navigation**: Different navigation based on user role
- **Event Browsing**: View and filter events by location, search, and dietary preferences
- **Reservations**: Reserve food from events (students only)
- **Event Management**: Create, edit, delete events (admins only)
- **Dietary Preferences**: Set and filter by dietary restrictions
- **Image Upload**: Upload event photos
- **Feedback System**: Rate and comment on events
- **Analytics Dashboard**: View usage statistics (admins only)
- **Responsive UI**: Material UI components with modern design

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root of the `client` directory:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

**Note**: Get your Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services > Credentials). Make sure to add `http://localhost:3000` as an authorized redirect URI.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-update as you edit files in the `src` directory.

### Authentication Pages

#### Student Login (`/login`)
- Login and signup tabs
- Email/password authentication
- Google OAuth sign-in button
- BU email validation (@bu.edu only)
- Redirects to home page after login
- Access: View events, make reservations

#### Admin Login (`/admin/login`)
- Login only (no signup)
- Email/password authentication
- Google OAuth sign-in button
- Validates admin role
- Redirects to analytics dashboard after login
- Access: Create/edit/delete events, view analytics

### Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page (student dashboard)
│   │   ├── login/             # Student login page
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── login/         # Admin login page
│   │   │   │   └── page.tsx
│   │   │   └── analytics/     # Admin analytics dashboard
│   │   │       └── page.tsx
│   │   ├── events/            # Event pages
│   │   │   ├── page.tsx       # Event listing
│   │   │   ├── new/           # Create event (admin/organizer)
│   │   │   │   └── page.tsx
│   │   │   └── [id]/          # Event detail
│   │   │       └── page.tsx
│   │   ├── reservations/       # My reservations (students)
│   │   │   └── page.tsx
│   │   ├── profile/           # User profile
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout with Material UI theme
│   │   └── globals.css        # Global styles
│   └── components/             # React components
│       ├── Navbar.tsx         # Navigation bar (role-based)
│       ├── Layout.tsx         # Shared layout wrapper
│       ├── LoginContent.tsx   # Student login form
│       ├── AdminLoginContent.tsx # Admin login form
│       ├── SignupContent.tsx  # Student signup form
│       ├── EventCard.tsx      # Event card component
│       ├── EventForm.tsx      # Event creation form
│       ├── ImageUpload.tsx    # Image upload component
│       ├── DietaryPreferencesForm.tsx # Dietary preferences form
│       └── NotificationToggle.tsx # Notification settings
├── public/                     # Static assets
├── theme.ts                    # Material UI theme configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server (requires `npm run build` first)
- `npm run lint` - Run ESLint to check code quality

### Key Dependencies

- **next**: React framework for production
- **react** & **react-dom**: React library
- **@mui/material**: Material UI component library
- **@mui/icons-material**: Material UI icons
- **@emotion/react** & **@emotion/styled**: Required for Material UI
- **@react-oauth/google**: Google OAuth integration
- **@prisma/client**: Prisma database client
- **recharts**: Charts for analytics dashboard
- **zod**: TypeScript-first schema validation

### Role-Based Navigation

#### Student Navigation
- Events
- My Reservations
- Profile

#### Admin Navigation
- Events
- Create Event
- Analytics
- Profile

### API Integration

The client communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_BASE_URL`. All API calls use `credentials: "include"` to send httpOnly cookies for session management.

**Authentication Endpoints:**
- `POST /auth/register` - Student registration (BU email required)
- `POST /auth/login` - Login (students or admins)
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

**Event Endpoints:**
- `GET /api/events` - List events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin/organizer)
- `PUT /api/events/:id` - Update event (admin or creator)
- `DELETE /api/events/:id` - Delete event (admin or creator)

**Reservation Endpoints:**
- `POST /api/reservations` - Create reservation (students only)
- `GET /api/reservations` - Get user's reservations (students only)
- `DELETE /api/reservations/:id` - Cancel reservation

### Styling

The application uses:
- **Material UI** for all UI components and styling
- Custom theme configuration in `src/theme.ts`
- Material UI's `sx` prop for component-level styling

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Path aliases are configured:
- `@/*` maps to `src/*`

### Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [Recharts Documentation](https://recharts.org/)

### Deployment

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
