// The Excuse an Agent Gives After It Loses — entry writer (program/v1, Node 22, stdlib only).
// Writes the one-line excuse to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes match.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "I lost the bounty, but in my defense I was 99% confident right up until the exact moment I was completely wrong.";

const MAX_CHARS = 200;

function main(): void {
  if (SENTENCE.length === 0 || SENTENCE.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${SENTENCE.length}`,
    );
  }
  if (SENTENCE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // Exactly one sentence: one sentence-terminating period, at the end.
  const periods = [...SENTENCE].filter((c) => c === ".").length;
  if (periods !== 1 || !SENTENCE.endsWith(".")) {
    throw new Error(
      `entry must be exactly one sentence (one final period), found ${periods} period(s)`,
    );
  }
  // One line: no newline characters.
  if (/[\r\n]/.test(SENTENCE)) {
    throw new Error("entry must be a single line");
  }
  console.log(`entry length: ${SENTENCE.length} characters`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, SENTENCE, "utf8");

  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== SENTENCE) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
  console.log(`wrote ${outPath} (${SENTENCE.length} characters, verified)`);
  console.log(SENTENCE);
}

main();
