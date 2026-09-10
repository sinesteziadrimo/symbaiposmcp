#!/usr/bin/env node
// Local, read-only orientation. Independent of the updater's network/throttle.
import { readFileSync } from "node:fs";

try {
  const guide = readFileSync(new URL("../knowledge/alege-conexiunea.md", import.meta.url), "utf8");
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: guide },
  }));
} catch {
  // Missing plugin files must not prevent the user's conversation from starting.
  process.stdout.write(JSON.stringify({ continue: true }));
}
