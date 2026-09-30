/**
 * Names that must not appear on public pages.
 * Match whole phrases so unrelated words stay valid.
 */
const FORBIDDEN_PUBLIC_NAME =
  /gallery\s*room|galleryroom|\bhelm\b|car\s*freedom|libertymaxxing|new\s*continent|acp[\s-]*tx|acptx|southern\s*worker|perfect\s*storm|civic\s*volunteer|infrawiki|buzz[\s-]*relay|acp[\s-]*site|staged\s*for\s*living|stealth\s*startup/i;

export function containsForbiddenPublicName(value: string | null | undefined): boolean {
  if (!value) return false;
  return FORBIDDEN_PUBLIC_NAME.test(value);
}

export function textContainsForbiddenPublicName(
  values: Array<string | null | undefined>,
): boolean {
  return values.some((value) => containsForbiddenPublicName(value));
}
