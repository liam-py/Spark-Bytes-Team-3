# Connection Pool Timeout Fix

## Problem
You're getting `P2024` errors: "Timed out fetching a new connection from the connection pool"

This happens when:
- The connection pool is exhausted (all connections are in use)
- The pool timeout is too short
- Connections aren't being released properly

## Solution

### Option 1: Update DATABASE_URL (Recommended)

Update your `.env` file's `DATABASE_URL` to include better pool settings:

**For Supabase Session Pooler (port 6543):**
```env
DATABASE_URL="postgresql://user:password@host:6543/database?sslmode=require&connect_timeout=10&pool_timeout=20&pgbouncer=true&connection_limit=5"
```

**For Direct Connection (port 5432) - Better for development:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require&connect_timeout=10&pool_timeout=20"
```

**Key parameters:**
- `pool_timeout=20` - Increase from 10 to 20 seconds (gives more time to get a connection)
- `connection_limit=5` - Limit concurrent connections (only for pooler, helps prevent exhaustion)
- Remove `pgbouncer=true` if using direct connection (port 5432)

### Option 2: Use Direct Connection for Development

If you're using the pooler (port 6543) and having issues, switch to direct connection:

1. Go to Supabase Dashboard → Settings → Database
2. Copy the "Direct connection" string (port 5432)
3. Update your `.env` with this connection string
4. Remove `pgbouncer=true` from the URL
5. Restart your server

### Option 3: Check for Connection Leaks

Make sure you're not creating multiple PrismaClient instances. The code should use the singleton `prisma` instance from `lib/db.ts`.

## After Making Changes

1. Restart your server completely
2. Try logging in again
3. Check server logs for connection pool warnings

## What We Fixed in Code

1. ✅ Added retry logic for P2024 errors (connection pool timeout)
2. ✅ Better error detection and logging
3. ✅ Automatic retry with exponential backoff for pool timeouts

The retry logic will now automatically retry up to 3 times if it gets a pool timeout, waiting 200ms, 400ms, then 600ms between retries.

