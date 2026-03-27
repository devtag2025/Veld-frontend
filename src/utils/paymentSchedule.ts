/**
 * Formats a Date to YYYY-MM-DD string in LOCAL timezone (avoids UTC shift).
 */
function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates an automatic payment schedule based on the total amount and hunt date.
 *
 * Rules:
 * 1. Initial Deposit of $5,000 due today.
 * 2. If February 1st of the hunt year falls between today and 60 days before the hunt,
 *    50% of the remaining balance is due on Feb 1st, and the other 50% is due 60 days before the hunt.
 * 3. Otherwise, the full remaining balance is due 60 days before the hunt.
 */
export function generatePaymentSchedule(
  totalAmount: number,
  huntDateStr: string
): Array<{ label: string; amount: number; dueDate: string }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const huntDate = new Date(huntDateStr);
  huntDate.setHours(0, 0, 0, 0);

  const deposit = 5000;
  const remaining = totalAmount - deposit;

  // 60 days before hunt
  const sixtyBefore = new Date(huntDate);
  sixtyBefore.setDate(sixtyBefore.getDate() - 60);

  const schedule: Array<{ label: string; amount: number; dueDate: string }> = [
    { label: "Initial Deposit", amount: deposit, dueDate: toLocalDateStr(today) },
  ];

  if (remaining <= 0) return schedule;

  // Find the relevant February 1st (same year as hunt)
  const feb1 = new Date(huntDate.getFullYear(), 1, 1); // month 1 = February
  feb1.setHours(0, 0, 0, 0);

  // Check if Feb 1 falls between today (exclusive) and 60 days before hunt (exclusive)
  const febIsRelevant =
    feb1.getTime() > today.getTime() && feb1.getTime() < sixtyBefore.getTime();

  if (febIsRelevant) {
    const halfRemaining = Math.round(remaining / 2);
    const otherHalf = remaining - halfRemaining;

    schedule.push({
      label: "February Balance (50%)",
      amount: halfRemaining,
      dueDate: toLocalDateStr(feb1),
    });
    schedule.push({
      label: "Final Balance",
      amount: otherHalf,
      dueDate: toLocalDateStr(sixtyBefore),
    });
  } else {
    schedule.push({
      label: "Final Balance",
      amount: remaining,
      dueDate: toLocalDateStr(sixtyBefore),
    });
  }

  return schedule;
}

/**
 * Validates that the hunt date is at least 60 days from today.
 */
export function isHuntDateValid(huntDateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const huntDate = new Date(huntDateStr);
  huntDate.setHours(0, 0, 0, 0);

  const diffMs = huntDate.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 60;
}
