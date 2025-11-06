# Spark! Bytes - Server

Express.js backend API for Spark! Bytes - a platform for sharing and discovering free food opportunities at Boston University.

## Tech Stack

- **Framework**: [Express.js](https://expressjs.com/) 5.1.0
- **Language**: TypeScript 5.9.3
- **Database**: Supabase (PostgreSQL via Prisma ORM)
- **ORM**: [Prisma](https://www.prisma.io/) 6.18.0
- **Authentication**: JWT (jsonwebtoken) with httpOnly cookies
- **OAuth**: Google OAuth 2.0 integration (google-auth-library)
- **Password Hashing**: bcryptjs
- **Validation**: Zod 4.1.12
- **File Upload**: Multer 1.4.5
- **CORS**: Enabled for cross-origin requests

## Features

- RESTful API architecture
- **Role-Based Access Control**: Separate student and admin authentication
- User authentication (register/login/logout)
- **Google OAuth Integration**: Sign in with Google (validates @bu.edu emails)
- JWT-based session management with httpOnly cookies
- Password hashing with bcryptjs
- Supabase (PostgreSQL) database with Prisma ORM
- TypeScript for type safety
- CORS configured for frontend integration
- Local file storage for event images
- Email notification system (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root of the `server` directory:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="your-secret-key-here-change-in-production"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Note**: 
- Get your Supabase connection string from your Supabase project (Settings > Database > Connection string - use Session Pooler for IPv4 compatibility)
- Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services > Credentials)

3. Initialize the database:
```bash
npm run prisma:gen
npm run prisma:migrate
```

This will:
- Generate the Prisma client
- Create and run migrations to set up the database schema in Supabase

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:4000` (or the port specified in your `.env` file).

### Project Structure

```
server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.ts   # Authentication routes
│   │   ├── event.routes.ts  # Event CRUD routes
│   │   ├── reservation.routes.ts # Reservation routes
│   │   ├── dietary.routes.ts # Dietary preferences routes
│   │   ├── feedback.routes.ts # Feedback routes
│   │   ├── upload.routes.ts  # Image upload routes
│   │   ├── notification.routes.ts # Notification routes
│   │   ├── organizer.routes.ts # Organizer verification routes
│   │   └── analytics.routes.ts # Analytics routes (admin only)
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── event.controller.ts
│   │   ├── reservation.controller.ts
│   │   └── ...
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   ├── event.service.ts
│   │   └── ...
│   ├── repositories/         # Data access layer
│   │   ├── user.repo.ts
│   │   ├── event.repo.ts
│   │   └── ...
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts # Authentication middleware
│   │   ├── role.middleware.ts # Role-based access control
│   │   └── upload.middleware.ts # File upload middleware
│   ├── validators/           # Zod validation schemas
│   │   ├── user.validator.ts
│   │   ├── event.validator.ts
│   │   └── ...
│   └── lib/
│       └── db.ts            # Prisma client instance
├── prisma/
│   └── schema.prisma        # Database schema
├── uploads/                 # Local file storage (created automatically)
│   └── events/             # Event images
├── dist/                     # Compiled JavaScript (generated)
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload (ts-node-dev)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires `npm run build` first)
- `npm run prisma:gen` - Generate Prisma client

### API Endpoints

#### Authentication

- **POST** `/auth/register` - Register a new student
  - Body: `{ email: string, password: string, name?: string }`
  - Validation: Email must end with `@bu.edu`
  - Returns: `{ id, email, name, role, createdAt }`
  - Status: 201 (success), 409 (email taken), 400 (invalid email)

- **POST** `/auth/login` - Login (students or admins)
  - Body: `{ email: string, password: string }`
  - Returns: `{ ok: true, user: { id, email, name, role, isOrganizer } }`
  - Sets httpOnly cookie: `sb_session`
  - Status: 200 (success), 401 (invalid credentials)

- **GET** `/auth/me` - Get current user information
  - Requires: Valid session cookie
  - Returns: `{ user: { id, email, name, role, isOrganizer } | null }`
  - Status: 200

- **POST** `/auth/logout` - Logout (clear session)
  - Returns: `{ ok: true }`
  - Clears session cookie
  - Status: 200

#### Events

- **GET** `/api/events` - List all events
  - Query params: `?location=...&search=...&dietaryFilters=...`
  - Returns: Array of events with food items
  - Status: 200

- **GET** `/api/events/:id` - Get event details
  - Returns: Event with food items, creator, and feedback
  - Status: 200, 404

- **POST** `/api/events` - Create event (admin or organizer only)
  - Requires: Authentication + admin/organizer role
  - Body: `{ title, location, startTime, endTime, foodItems[], imagePath? }`
  - Returns: Created event
  - Status: 201, 403 (unauthorized)

- **PUT** `/api/events/:id` - Update event (admin or creator)
  - Requires: Authentication
  - Body: `{ title?, location?, startTime?, endTime?, imagePath? }`
  - Returns: Updated event
  - Status: 200, 403, 404

- **DELETE** `/api/events/:id` - Delete event (admin or creator)
  - Requires: Authentication
  - Returns: `{ message: "Event deleted successfully" }`
  - Status: 200, 403, 404

#### Reservations (Students Only)

- **POST** `/api/reservations` - Create reservation
  - Requires: Authentication (students only, admins rejected)
  - Body: `{ eventId: string, quantity?: number }`
  - Returns: Created reservation
  - Status: 201, 403 (admin), 409 (already reserved), 400 (no food available)

- **GET** `/api/reservations` - Get user's reservations
  - Requires: Authentication (students only)
  - Returns: Array of user's active reservations
  - Status: 200

- **DELETE** `/api/reservations/:id` - Cancel reservation
  - Requires: Authentication
  - Returns: `{ message: "Reservation cancelled successfully" }`
  - Status: 200, 404

#### Other Endpoints

- **GET** `/api/dietary` - Get dietary preferences
- **PUT** `/api/dietary` - Update dietary preferences
- **POST** `/api/feedback` - Submit feedback (students who reserved only)
- **GET** `/api/feedback/event/:eventId` - Get event feedback
- **POST** `/api/upload` - Upload image (admin/organizer only)
- **PUT** `/api/notifications/preferences` - Update notification preferences
- **GET** `/api/analytics/overview` - Get analytics (admin only)
- **POST** `/organizer/request` - Request organizer status
- **GET** `/organizer/pending` - Get pending requests (admin only)
- **POST** `/organizer/approve/:userId` - Approve organizer (admin only)

### Database Schema

The application uses Prisma with Supabase (PostgreSQL). Key models include:

- **User**: id, email, name, role (STUDENT/ORGANIZER/ADMIN), isOrganizer, notificationEnabled
- **Event**: id, title, location, startTime, endTime, imagePath, createdBy
- **FoodItem**: id, eventId, name, quantity, reserved, dietaryInfo
- **Reservation**: id, userId, eventId, quantity, status
- **Feedback**: id, userId, eventId, rating, comment
- **DietaryPrefs**: id, userId, isVegan, isVegetarian, isHalal, isKosher, allergies

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT token signing | `dev-secret` |
| `PORT` | Server port number | `4000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HttpOnly Cookies**: Session tokens stored in httpOnly cookies to prevent XSS attacks
- **CORS**: Configured to allow requests from the frontend origin only
- **Input Validation**: Request validation using Zod schemas
- **Role-Based Access**: Middleware to enforce student vs admin permissions
- **BU Email Validation**: Only @bu.edu emails allowed for registration

### Role-Based Access Control

#### Students
- Can view events
- Can create reservations
- Can leave feedback on events they reserved
- Cannot create/edit/delete events
- Cannot access admin endpoints

#### Admins
- Can create, edit, and delete any event
- Can upload images
- Can view analytics dashboard
- Can manage organizer verification
- Cannot create reservations (view-only)

### File Storage

- Images are stored locally in `server/uploads/events/` directory
- Served via Express static middleware at `/uploads/events/`
- File validation: JPEG/PNG only, max 5MB
- Upload directory is gitignored

### Key Dependencies

- **express**: Web framework
- **@prisma/client**: Prisma database client
- **jsonwebtoken**: JWT token generation and verification
- **google-auth-library**: Google OAuth 2.0 authentication
- **bcryptjs**: Password hashing
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-Origin Resource Sharing middleware
- **multer**: File upload handling
- **zod**: Schema validation

### Development Tools

- **ts-node-dev**: TypeScript execution with hot reload
- **typescript**: TypeScript compiler
- **@types/\***: TypeScript type definitions

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="strong-random-secret-key"
PORT=4000
CORS_ORIGIN="https://your-frontend-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. Start the server:
```bash
npm start
```

### Notes

- The server uses Supabase (PostgreSQL). Create a project at [supabase.com](https://supabase.com) and get your connection string. Use Session Pooler (port 6543) for IPv4 compatibility.
- The `secure` flag for cookies is set to `false` in development. Set it to `true` in production with HTTPS.
- Make sure to use a strong, random `JWT_SECRET` in production.
- Google OAuth requires configuring authorized redirect URIs in Google Cloud Console (add `http://localhost:3000` for development).
- Create the `uploads/events/` directory manually or it will be created automatically on first upload.
- Run `npm run prisma:migrate` after schema changes to update your Supabase database.
