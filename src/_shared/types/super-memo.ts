import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { cards, decks, reviews, uiState } from '../../main/database/schema';

export type Deck = InferSelectModel<typeof decks>;
export type Card = InferSelectModel<typeof cards>;
export type Review = InferSelectModel<typeof reviews>;
export type UIState = InferSelectModel<typeof uiState>;

export type NewDeck = InferInsertModel<typeof decks>;
export type NewCard = InferInsertModel<typeof cards>;
export type NewReview = InferInsertModel<typeof reviews>;
export type NewUIState = InferInsertModel<typeof uiState>;

export type DeckWithCards = Deck & {
  cards: Card[];
};

export type CardWithReviews = Card & {
  reviews: Review[];
};

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export type SM2Result = {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
  lastReviewed: Date;
};
