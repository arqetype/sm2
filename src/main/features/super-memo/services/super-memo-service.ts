import { Quality } from '@shared/types/super-memo';
import { cards, reviews } from '@main/database/schema';
import { Card, Review } from '@shared/types/super-memo';
import { compute } from '@main/features/super-memo/lib/compute';
import { now, addDays } from '@main/features/super-memo/lib/dates';
import { db } from '@main/database';
import { eq } from 'drizzle-orm';

type ReviewResult = {
  card: Card;
  review: Review;
};

export async function reviewCardSM2Theory(cardId: number, quality: Quality): Promise<ReviewResult> {
  const [card] = await db.select().from(cards).where(eq(cards.id, cardId));
  if (!card) {
    throw new Error(`Card ${cardId} not found`);
  }

  const beforeInterval = card.interval;
  const beforeEF = card.easeFactor;

  const computed = compute(
    {
      intervalDays: card.interval,
      repetitions: card.repetitions,
      easeFactor: card.easeFactor
    },
    quality
  );

  const nextReviewDate = addDays(now(), computed.nextIntervalDays);

  await db
    .update(cards)
    .set({
      interval: computed.nextIntervalDays,
      repetitions: computed.nextRepetitions,
      easeFactor: computed.nextEaseFactor,
      nextReview: nextReviewDate,
      lastReviewed: now()
    })
    .where(eq(cards.id, cardId));

  const [inserted] = await db
    .insert(reviews)
    .values({
      cardId,
      quality,
      reviewedAt: now(),
      intervalBefore: beforeInterval,
      intervalAfter: computed.nextIntervalDays,
      easeFactorBefore: beforeEF,
      easeFactorAfter: computed.nextEaseFactor
    })
    .returning();

  const [updatedCard] = await db.select().from(cards).where(eq(cards.id, cardId));

  return {
    card: updatedCard,
    review: inserted
  };
}
