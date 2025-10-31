import type { Quality } from '../../../../_shared/types/super-memo';

type SM2Input = {
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
};

type SM2Output = {
  nextIntervalDays: number;
  nextRepetitions: number;
  nextEaseFactor: number;
};

function clampEaseFactor(ef: number): number {
  return Math.max(ef, 1.3);
}

function clampIntervalDays(days: number): number {
  const d = Math.round(days);
  return d < 1 ? 1 : d;
}

function updateEaseFactor(ef: number, quality: Quality): number {
  const dq = 5 - quality;
  const next = ef + (0.1 - dq * (0.08 + dq * 0.02));
  return clampEaseFactor(next);
}

export function compute(input: SM2Input, quality: Quality): SM2Output {
  const { intervalDays: I, repetitions: n, easeFactor: EF } = input;

  const nextEF = updateEaseFactor(EF, quality);

  if (quality < 3) {
    return {
      nextIntervalDays: 1,
      nextRepetitions: 0,
      nextEaseFactor: nextEF
    };
  }

  let nextI: number;
  if (n === 0) {
    nextI = 1;
  } else if (n === 1) {
    nextI = 6;
  } else {
    nextI = clampIntervalDays(Math.round(I * nextEF));
  }

  return {
    nextIntervalDays: clampIntervalDays(nextI),
    nextRepetitions: n + 1,
    nextEaseFactor: nextEF
  };
}
