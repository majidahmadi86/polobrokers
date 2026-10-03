import "server-only";

// Caption to alt text. Instagram captions are free text: they can carry emoji and dashes the site
// never shows. Emoji are removed, an em or en dash becomes a comma, whitespace collapses, and the
// result is cut at 120 characters on a word boundary. Empty result: null (the UI uses its fallback).
// Banned characters are built from code points so this file never contains them.

const cp = (...codes: number[]) => String.fromCodePoint(...codes);
const MAX = 120;

const DASH = new RegExp(String.raw`\s*[${cp(0x2013, 0x2014)}]\s*`, "gu");
const EMOJI = new RegExp(
  String.raw`[\p{Extended_Pictographic}\p{Emoji_Modifier}${cp(0xfe0f, 0xfe0e, 0x200d, 0x20e3)}]|[${cp(0x1f1e6)}-${cp(0x1f1ff)}]|[${cp(0xe0020)}-${cp(0xe007f)}]`,
  "gu",
);
const SPACE = /\s+/gu;
const EDGE = /^[\s,;:.]+|[\s,;:]+$/gu;

export function sanitizeCaption(caption: string | null | undefined): string | null {
  if (!caption) return null;
  let text = caption.replace(EMOJI, " ").replace(DASH, ", ").replace(SPACE, " ");
  // A comma left in front of other punctuation by a removed dash ("word ,." or ", ,").
  text = text.replace(/ ,/gu, ",").replace(/,(\s*,)+/gu, ",").replace(EDGE, "");
  if (text.length > MAX) {
    const cut = text.slice(0, MAX + 1);
    const space = cut.lastIndexOf(" ");
    text = (space > 0 ? cut.slice(0, space) : text.slice(0, MAX)).replace(EDGE, "");
  }
  return text || null;
}
