import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  dietaryPreference: text('dietary_preference'),
  alcoholPreference: boolean('alcohol_preference'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  venue: text('venue').notNull(),
  date: timestamp('date').notNull(),
  hostId: uuid('host_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventParticipants = pgTable('event_participants', {
  eventId: serial('event_id')
    .references(() => events.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  confirmed: text('confirmed').default('pending'),
});

export const friendships = pgTable('friendships', {
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  friendId: uuid('friend_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});