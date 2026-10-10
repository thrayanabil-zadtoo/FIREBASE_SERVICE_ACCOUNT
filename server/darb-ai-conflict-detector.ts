// Conservative conflict detector.
// It only flags potentially conflicting snippets for human-readable handling;
// it does not decide which source is correct.

export function detectPotentialConflicts(
  sources: Array<{title?: string; snippet?: string; source?: string}>
): string[] {
  const groups: string[] = [];
  const dateClaims = sources
    .map(s => `${s.title || ""} ${s.snippet || ""}`)
    .filter(Boolean);

  const hasDifferentNumbers = /\b\d[\d,.]*\b/.test(dateClaims.join(" "));
  const keywords = ["رسوم", "مدة", "السعر", "الراتب", "الموعد", "شروط", "مدة الإقامة"];

  if (hasDifferentNumbers && dateClaims.length > 1) {
    groups.push("توجد أرقام أو مدد مختلفة بين بعض النتائج؛ لم يتم ترجيح مصدر على آخر تلقائياً.");
  }

  for (const k of keywords) {
    const hits = dateClaims.filter(x => x.includes(k));
    if (hits.length > 1) {
      groups.push(`توجد معلومات متعددة حول «${k}» وقد تحتاج إلى مراجعة المصدر الرسمي.`);
    }
  }

  return [...new Set(groups)];
}
