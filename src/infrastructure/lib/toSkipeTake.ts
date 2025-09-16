export function toSkipeTake(
  page: number,
  limit: number,
): { take: number; skip: number } {
  const take = Math.min(Math.max(limit, 1), 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}

