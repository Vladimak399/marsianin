/**
 * Font setup placeholders.
 *
 * Do not import or apply globally until the actual font file is added
 * and confirmed.
 */

export const HALVAR_MITTEL_FILE = '/fonts/HalvarMittel-Rg.woff';

export const halvarMittelLocalFontConfig = {
  src: HALVAR_MITTEL_FILE,
  display: 'swap' as const,
  variable: '--font-halvar-mittel',
};
