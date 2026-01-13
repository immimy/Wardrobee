## ISR issue when deploying on Vercel

- Pre-rendering '/products/:id' routes failed because ISR triggers build-time parallel pre-rendering, and Prisma cannot handle multiple concurrent DB connections in Vercel’s serverless environment.
