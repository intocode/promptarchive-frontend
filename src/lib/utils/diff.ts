import { diffWords } from "diff";

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function computeWordDiff(original: string, improved: string): DiffPart[] {
  return diffWords(original, improved);
}
