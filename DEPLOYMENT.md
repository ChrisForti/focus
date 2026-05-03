# Deployment Checklist for Railway

## Pre-Deployment

- [ ] Ensure all environment variables are set in `.env`
- [ ] Test locally with `npm run dev`
- [ ] Build successfully with `npm run build`
- [ ] Database migrations generated with `npm run db:generate`

## Railway Setup

1. **Create PostgreSQL Database**
   - In Railway dashboard, add a PostgreSQL service
   - Note the `DATABASE_URL` environment variable

2. **Create Web Service**
   - Connect GitHub repository
   - Railway will auto-detect Node.js project
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Environment Variables**
   Required variables:
   - `DATABASE_URL` - Auto-populated by Railway
   - `OPENAI_API_KEY` - Add from OpenAI dashboard
   - `NODE_ENV` - Set to `production`
   - `PORT` - Optional (Railway sets automatically)

4. **Push Database Schema**
   After first deployment, run:

   ```bash
   npm run db:push
   ```

   Or manually push using Railway CLI or the database connection

5. **Verify Deployment**
   - Check logs in Railway dashboard
   - Test health endpoint: `https://your-app.railway.app/health`
   - Test API with a sample voice recording

## Post-Deployment

- [ ] Verify database connection
- [ ] Test `/health` endpoint
- [ ] Test `/api/process-voice` with sample audio
- [ ] Check logs for any errors
- [ ] Set up monitoring/alerts (optional)

## Troubleshooting

**Database Connection Issues:**

- Verify `DATABASE_URL` is correctly set
- Check SSL settings in `src/db/index.ts`
- Ensure database is accessible from web service

**OpenAI API Issues:**

- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has sufficient credits
- Review rate limits

**Build Failures:**

- Check TypeScript compilation errors
- Verify all dependencies are in `package.json`
- Review Railway build logs

## Useful Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# View logs
railway logs

# Run commands in Railway environment
railway run npm run db:push
```
