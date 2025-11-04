# Spark! Bytes - Client

Next.js frontend application for Spark! Bytes - a platform for sharing and discovering free food opportunities.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **React**: 18.3.1
- **UI Components**: [Ant Design](https://ant.design/) 5.19.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.1.16
- **Language**: TypeScript 5
- **Database Client**: Prisma 6.18.0
- **Authentication**: JWT with httpOnly cookies

## Features

- User authentication (login/signup)
- Session management via httpOnly cookies
- Responsive UI with Ant Design components
- Form validation with Ant Design Forms
- Modern styling with Tailwind CSS

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
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-update as you edit files in the `src` directory.

### Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── authentication/    # Authentication page
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   └── components/             # React components
│       ├── LoginContent.tsx   # Login form component
│       └── SignupContent.tsx  # Signup form component
├── public/                     # Static assets
├── prisma.config.ts           # Prisma configuration
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
- **antd**: Enterprise-class UI design language and React UI library
- **@prisma/client**: Prisma database client
- **bcryptjs**: Password hashing (for client-side validation reference)
- **jsonwebtoken**: JWT token handling (for client-side validation reference)
- **zod**: TypeScript-first schema validation

### API Integration

The client communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_BASE_URL`. All API calls use `credentials: "include"` to send httpOnly cookies for session management.

**Authentication Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **Ant Design** components for consistent UI elements
- Custom styles in `src/app/globals.css`

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Path aliases are configured:
- `@/*` maps to `src/*`

### Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Deployment

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
