import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);
    const { eventDetails } = req.body;

    // Save the event to the database
    // ...

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
}