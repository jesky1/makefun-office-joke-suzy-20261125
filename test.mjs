// test.mjs — checks for the office-joke entry writer.
// Run: node --test test.mjs
import test from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import { tmpdir as tempRoot } from "node:os";
import { join as joinPath } from "node:path";

// Runs main.ts once into a throwaway folder and hands back the bytes
// it wrote, so each test reads a fresh, real output file.
function buildEntry() {
  const folder = fs.mkdtempSync(joinPath(tempRoot(), "joke-check-"));
  execFileSync(process.execPath, ["main.ts"], {
    cwd: import.meta.dirname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: folder },
    encoding: "utf8",
  });
  const bytes = fs.readFileSync(joinPath(folder, "entry.txt"));
  fs.rmSync(folder, { recursive: true, force: true });
  return bytes;
}

function sha(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

test("the output is one joke: 1–200 chars, one line, not blank", () => {
  const text = buildEntry().toString("utf8");
  assert.ok(text.length >= 1 && text.length <= 200, `got ${text.length} chars`);
  assert.equal(text.trim(), text, "no leading or trailing whitespace");
  assert.ok(!/[\r\n]/.test(text), "must be a single line");
});

test("two builds hash identically", () => {
  assert.equal(sha(buildEntry()), sha(buildEntry()));
});

test("the joke is about HR, a standing desk, and unchanged pay", () => {
  const text = buildEntry().toString("utf8");
  for (const word of ["HR", "standing desk", "same money"]) {
    assert.ok(text.includes(word), `missing ${word}`);
  }
});
