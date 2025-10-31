import { relations } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const uiState = sqliteTable('ui-state', {
  id: integer('id').primaryKey(),
  width: integer('width').notNull().default(1024),
  height: integer('height').notNull().default(768),
  x: integer('x'),
  y: integer('y'),
  isMaximised: integer('is_maximised').notNull().default(0),
  openedFolder: text('opened_folder')
});

export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
});

export const cards = sqliteTable(
  'cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deckId: integer('deck_id')
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),

    interval: integer('interval').notNull().default(0),
    repetitions: integer('repetitions').notNull().default(0),
    easeFactor: real('ease_factor').notNull().default(2.5),
    nextReview: integer('next_review', { mode: 'timestamp' }),
    lastReviewed: integer('last_reviewed', { mode: 'timestamp' })
  },
  table => [
    index('cards_next_review_idx').on(table.nextReview),
    index('cards_deck_id_idx').on(table.deckId)
  ]
);

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cardId: integer('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  quality: integer('quality').notNull(),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  intervalBefore: integer('interval_before').notNull(),
  intervalAfter: integer('interval_after').notNull(),
  easeFactorBefore: real('ease_factor_before').notNull(),
  easeFactorAfter: real('ease_factor_after').notNull()
});

export const decksRelations = relations(decks, ({ many }) => ({
  cards: many(cards)
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id]
  }),
  reviews: many(reviews)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  card: one(cards, {
    fields: [reviews.cardId],
    references: [cards.id]
  })
}));
