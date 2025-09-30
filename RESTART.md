# Quick Restart & Cache Clear

## Full Reset (Nuclear Option)
```bash
# Kill all dev servers
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Clear node modules (if needed)
rm -rf node_modules && npm install

# Restart
npm run dev
```

## Standard Restart
```bash
# Kill dev server
pkill -f "next dev"

# Clear build cache
rm -rf .next

# Restart
npm run dev
```

## Quick Restart (No Cache Clear)
```bash
# Kill and restart
pkill -f "next dev" && npm run dev
```

## Database Reset
```bash
# Delete database
rm -f prisma/dev.db prisma/dev.db-journal

# Recreate schema
npx prisma db push

# Restart server
npm run dev
```

## Common Issues

**Port already in use:** `pkill -f "next dev"` or `lsof -ti:3000 | xargs kill -9`

**Routes not updating:** Delete `.next` folder

**Database schema mismatch:** `npx prisma db push`

**TypeScript errors:** `rm -rf .next && npm run build`
