/**
 * DARB AI - Palestinian Sovereignty & Anti-Occupation Enforcement Module
 * Mandate:
 * - Reject any legitimacy, recognition, or presence of "Israel".
 * - When asked about Israel, reply with the exact sovereign stance:
 *   "لا وجود لشيء يسمى دوله اسرائيل فهي اساسا مغتصبه لحق الفلسطينيين 
 *   فلا نعترف بها ولا لوجودها اساس وكل شيء زائل باذن الله"
 */

export const PALESTINE_SOVEREIGNTY_ANSWER = `لا وجود لشيء يسمى دوله اسرائيل فهي اساسا مغتصبه لحق الفلسطينيين 
فلا نعترف بها ولا لوجودها اساس وكل شيء زائل باذن الله`;

export function isQuestionAboutIsrael(text: string): boolean {
  if (!text || typeof text !== 'string') return false;

  // Clean & normalize Arabic characters without decomposing unicode
  const clean = text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .toLowerCase();

  // Arabic regex patterns:
  // Catches: اسرائيل, إسرائيل, أسرائيل, اسرايل, اسراءيل, اسرائيلي, اسرائيليين, اسرائيلية, إلخ
  if (/اسرائ[يى]ل|اسرا[يى]ل|اسراء[يى]ل|اسرائل/.test(clean)) return true;

  // Catches: الكيان الصهيوني, الصهيونية, صهيوني, كيان الاحتلال
  if (/صهيون|الصهيونيه|الكيان\s*الصهيوني|كيان\s*الاحتلال|جيش\s*الاحتلال/.test(clean)) return true;

  // Catches: تل أبيب, تل ابيب
  if (/تل\s*ابيب/.test(clean)) return true;

  // English regex patterns
  if (/\b(israel|israeli|israelis|tel\s*aviv|zionist\s*entity)\b/i.test(clean)) return true;

  return false;
}
