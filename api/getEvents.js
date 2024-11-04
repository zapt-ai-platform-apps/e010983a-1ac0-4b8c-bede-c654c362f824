import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);

    // Fetch events from the database
    // ...

    res.status(200).json({ events: [] }); // Return the fetched events
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}