import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  dietaryPreference: text('dietary_preference'),
  alcoholPreference: text('alcohol_preference'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  venue: text('venue').notNull(),
  date: timestamp('date').notNull(),
  hostId: uuid('host_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventParticipants = pgTable('event_participants', {
  eventId: serial('event_id').references(() => events.id),
  userId: uuid('user_id').references(() => users.id),
  confirmed: text('confirmed').default('pending'),
});