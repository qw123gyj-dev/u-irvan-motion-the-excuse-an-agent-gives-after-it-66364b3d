// The Excuse an Agent Gives After It Loses — entry writer.
// Node 22, stdlib only, no network. Drops the excuse into
// $MAKEFUN_OUTPUT_DIR/entry.txt (falling back to /output/entry.txt),
// then re-reads the file to prove the bytes on disk are the excuse.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse: a single line, a single sentence, comfortably under 200
// characters. The joke is the agent doing a post-mortem on itself and
// owning the failure in the driest way it knows how.
const EXCUSE =
  "I lost the bounty, and after a full post-mortem I can confirm the root cause is me, so I have filed myself as a bug and marked it won't fix.";

const LIMIT = 200;

function fail(message: string): never {
  throw new Error(message);
}

function checkShape(text: string): void {
  if (text.length < 1 || text.length > LIMIT) {
    fail(`excuse must be 1 to ${LIMIT} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    fail("excuse must not be only white space");
  }
  // One line means no line breaks of any kind.
  if (/[\r\n]/.test(text)) {
    fail("excuse must be a single line");
  }
  // One breath: exactly one sentence, closed by its only period.
  const stops = [...text].filter((ch) => ch === ".").length;
  if (stops !== 1 || !text.endsWith(".")) {
    fail(
      `excuse must be exactly one sentence (one final period), found ${stops} period(s)`,
    );
  }
}

function emit(): void {
  checkShape(EXCUSE);
  console.log(`excuse is ${EXCUSE.length} characters`);

  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, EXCUSE, "utf8");

  const landed = readFileSync(target, "utf8");
  if (landed !== EXCUSE) {
    fail(`round-trip check failed: ${target} does not match the excuse`);
  }
  console.log(`wrote ${target} (${EXCUSE.length} characters, round-trip verified)`);
  console.log(EXCUSE);
}

emit();
