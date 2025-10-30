import type { Card, Quality, SM2Result } from '../../../../_shared/types/super-memo';

export function calculateSM2(card: Card, quality: Quality): SM2Result {
  let { interval, repetitions, easeFactor } = card;

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    interval,
    repetitions,
    easeFactor,
    nextReview,
    lastReviewed: now
  };
}
