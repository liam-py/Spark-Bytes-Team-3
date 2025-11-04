# Spark! Bytes - Server

Express.js backend API for Spark! Bytes - a platform for sharing and discovering free food opportunities.

## Tech Stack

- **Framework**: [Express.js](https://expressjs.com/) 5.1.0
- **Language**: TypeScript 5.9.3
- **Database**: SQLite (via Prisma ORM)
- **ORM**: [Prisma](https://www.prisma.io/) 6.18.0
- **Authentication**: JWT (jsonwebtoken) with httpOnly cookies
- **Password Hashing**: bcryptjs
- **Validation**: Zod 4.1.12
- **CORS**: Enabled for cross-origin requests

## Features

- RESTful API architecture
- User authentication (register/login/logout)
- JWT-based session management with httpOnly cookies
- Password hashing with bcryptjs
- SQLite database with Prisma ORM
- TypeScript for type safety
- CORS configured for frontend integration

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- SQLite (usually included with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root of the `server` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here-change-in-production"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

3. Initialize the database:
```bash
npm run prisma:gen
npm run prisma:migrate
```

This will:
- Generate the Prisma client
- Create the SQLite database file
- Run migrations to set up the database schema

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
│   │   └── auth.routes.ts   # Authentication routes
│   ├── controllers/          # Request handlers
│   │   └── auth.controller.ts
│   ├── services/             # Business logic
│   │   └── user.service.ts
│   └── repositories/         # Data access layer
│       └── user.repo.ts
├── prisma/
│   └── schema.prisma        # Database schema
├── dist/                     # Compiled JavaScript (generated)
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload (ts-node-dev)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires `npm run build` first)
- `npm run prisma:gen` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### API Endpoints

All endpoints are prefixed with `/auth`:

#### Authentication

- **POST** `/auth/register` - Register a new user
  - Body: `{ email: string, password: string, name?: string }`
  - Returns: `{ id, email, name, createdAt }`
  - Status: 201 (success), 409 (email taken), 400 (invalid request)

- **POST** `/auth/login` - Login with email and password
  - Body: `{ email: string, password: string }`
  - Returns: `{ ok: true, user: { id, email, name } }`
  - Sets httpOnly cookie: `sb_session`
  - Status: 200 (success), 401 (invalid credentials)

- **GET** `/auth/me` - Get current user information
  - Requires: Valid session cookie
  - Returns: `{ user: { id, email, name } | null }`
  - Status: 200

- **POST** `/auth/logout` - Logout (clear session)
  - Returns: `{ ok: true }`
  - Clears session cookie
  - Status: 200

### Database Schema

The application uses Prisma with SQLite. The User model includes:

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String
  createdAt    DateTime @default(now())
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database connection string | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT token signing | `dev-secret` |
| `PORT` | Server port number | `4000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HttpOnly Cookies**: Session tokens stored in httpOnly cookies to prevent XSS attacks
- **CORS**: Configured to allow requests from the frontend origin only
- **Input Validation**: Request validation using Zod schemas

### Key Dependencies

- **express**: Web framework
- **@prisma/client**: Prisma database client
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-Origin Resource Sharing middleware
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
DATABASE_URL="file:./prod.db"
JWT_SECRET="strong-random-secret-key"
PORT=4000
CORS_ORIGIN="https://your-frontend-domain.com"
```

3. Start the server:
```bash
npm start
```

### Notes

- The server uses SQLite for development. For production, consider migrating to PostgreSQL or MySQL.
- The `secure` flag for cookies is set to `false` in development. Set it to `true` in production with HTTPS.
- Make sure to use a strong, random `JWT_SECRET` in production.

