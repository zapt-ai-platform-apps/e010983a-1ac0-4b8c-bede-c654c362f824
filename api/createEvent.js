import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import { events } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

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
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);
    const { name, category, venue, date } = req.body;

    if (!name || !category || !venue || !date) {
      return res.status(400).json({ error: 'Missing required event details' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const [newEvent] = await db.insert(events).values({
      name,
      category,
      venue,
      date: new Date(date),
      hostId: user.id,
    }).returning();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
}