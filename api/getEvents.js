import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import { events } from '../drizzle/schema.js';
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
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const userEvents = await db.select().from(events)
      .where(eq(events.hostId, user.id))
      .orderBy(events.date.asc());

    res.status(200).json({ events: userEvents });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}