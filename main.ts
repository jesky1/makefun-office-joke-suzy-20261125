// main.ts — One-Line Office Joke Laugh-Off entry writer.
// Puts one fresh office joke into /output/entry.txt for the judge.
import { mkdirSync as makeFolder, writeFileSync as putText } from "node:fs";
import { join as joinPath } from "node:path";

// The joke, drafted in this session: a raise request answered with
// furniture. HR swaps pay for posture, and the last clause — same
// money, standing up — is where the laugh sits.
const JOKE =
  "I asked HR for a raise and they gave me a standing desk, so now I earn the same money, just standing up.";

// Gate from the competition rules: entry.txt holds UTF-8 text of
// 1–200 characters, a single line, never whitespace alone.
const FLOOR = 1;
const CEILING = 200;
const TARGET = "entry.txt";

function fail(reason: string): never {
  throw new Error(`joke rejected: ${reason}`);
}

// Every rule the gate states, checked up front so a bad line dies
// here with a plain reason instead of shipping a rejected entry.
function checkJoke(text: string): void {
  if (text.length < FLOOR || text.length > CEILING) {
    fail(`length ${text.length} outside ${FLOOR}–${CEILING}`);
  }
  if (text.trim() === "") fail("blank");
  if (/[\r\n]/.test(text)) fail("must stay one line");
}

function main(): void {
  checkJoke(JOKE);
  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  makeFolder(folder, { recursive: true });
  putText(joinPath(folder, TARGET), JOKE, "utf8");
  console.log(`entry.txt ready: ${JOKE.length} characters in ${folder}`);
}

main();
