import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import { users } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'PUT') {
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);
    const { dietaryPreference, alcoholPreference } = req.body;

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    await db
      .update(users)
      .set({
        dietaryPreference,
        alcoholPreference,
      })
      .where(eq(users.id, user.id));

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
}