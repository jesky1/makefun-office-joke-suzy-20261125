// main.ts — One-Line Office Joke Laugh-Off (make.fun)
// Writes one original one-line office joke to /output/entry.txt.
// Node 22.18+ runs this TypeScript directly (type stripping).
import { mkdirSync, writeFileSync } from "node:fs";

// The entry line, written in this session. The joke turns a raise
// request into a furniture upgrade: HR answers a pay question with
// a standing desk, so the punchline lands on the gap between what
// was asked for and what was given — same money, new posture.
const ENTRY =
  "I asked HR for a raise and they gave me a standing desk, so now I earn the same money, just standing up.";

// The competition gate, mirrored here so a bad edit fails loudly at
// build time instead of silently shipping a rejected entry: exactly one
// line, 1–200 characters, never only whitespace.
const GATE_MIN = 1;
const GATE_MAX = 200;

function validateEntry(line: string): void {
  if (line.length < GATE_MIN || line.length > GATE_MAX) {
    throw new Error(
      `entry length ${line.length} is outside the ${GATE_MIN}-${GATE_MAX} gate`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}
validateEntry(ENTRY);

// The competition reads exactly one file, entry.txt, from the output
// directory — the name is fixed, so it lives in one place.
const ENTRY_FILE = "entry.txt";

function writeEntry(outDir: string, line: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/${ENTRY_FILE}`, line, "utf8");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
writeEntry(outDir, ENTRY);
console.log(`Wrote ${ENTRY.length} characters to ${outDir}/${ENTRY_FILE}`);
