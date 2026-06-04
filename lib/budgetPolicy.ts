export const MAX_DAILY_BUDGET = 50;

export const parseBudgetAmount = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};
